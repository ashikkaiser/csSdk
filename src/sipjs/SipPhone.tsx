import {
	ACCEPTED,
	INCOMING,
	OUTGOING,
	PROGRESS,
	TERMINATED,
	HOLD,
} from "./SessionStates";
import * as requestActions from "../redux/actions/requestActions";
import * as stateActions from "../redux/actions/stateActions";
import {
	Inviter,
	Registerer,
	RegistererState,
	SessionState,
	UserAgent,
} from "sip.js";

let store: any = null;

export default class SipCaller {
	_ua: UserAgent | null;
	earlyMedia: HTMLAudioElement;

	static init(data: any) {
		store = data.store;
	}
	constructor() {
		this._ua = null;
		this._init();
		this.earlyMedia = new Audio("./../media/EarlyMedia.mp3");
	}

	_init() {
		this.register();
	}
	register() {
		const { displayName, sipUri, password, wssServer } =
			store.getState().user;

		const options = {
			uri: UserAgent.makeURI(`sip:${sipUri}@sip-prod.cleverstack.in`),
			authorizationUsername: sipUri,
			authorizationPassword: password,
			displayName: displayName,
			transportOptions: {
				server: `wss://${wssServer}:7443`,
				traceSip: false,
			},

			sessionDescriptionHandlerFactoryOptions: {
				peerConnectionConfiguration: {
					iceServers: [
						{
							urls: "stun:stun.l.google.com:19302",
						},
					],
					turnServers: {
						urls: ["turn:turn.telnyx.com:3478?transport=tcp"],
						username: "ashikkaiser",
						password: "12345678",
					},
				},
				iceGatheringTimeout: 500,
			},
			logBuiltinEnabled: false,
			reconnectionAttempts: 5,
			delegate: {
				onInvite: (sipSession: any) => {
					store.dispatch(
						requestActions.notify({
							text: `Incoming call from: ${sipSession.remoteIdentity.uri.user}`,
						})
					);
					sipSession.delegate = {
						// Handle incoming REFER request.
						onBye: (session: any) => {
							console.log("onBye", session);
						},
					};

					// Handle incoming session state changes.
					sipSession.stateChange.addListener(
						(newState: SessionState) => {
							switch (newState) {
								case SessionState.Establishing:
									console.log("Establishing");
									break;
								case SessionState.Established:
									this._getAudioElement(sipSession);
									this._onProgress(sipSession);

									// Session has been established.
									console.log("Established");
									break;
								case SessionState.Terminated:
									// Session has terminated.
									this._tarminateSession(sipSession);
									console.log("Terminated");
									break;
								default:
									break;
							}
						}
					);
					console.log("Sss", sipSession);

					this._handleSession(sipSession, INCOMING);
				},
			},
		};
		this._ua = new UserAgent(options);
		const registerer = new Registerer(this._ua);
		this._ua.start().then(() => {
			registerer.register().then(() => {});
		});

		registerer.stateChange.addListener((state: any) => {
			if (state === RegistererState.Registered) {
				store.dispatch(
					stateActions.setRegistrationMessage({
						registrationMessage: "Success",
					})
				);
				store.dispatch(
					stateActions.setRegistered({ registered: true })
				);
			} else {
				console.log("unregistered");
			}
		});
	}

	accept(sipSession: any) {
		sipSession.accept({
			sessionDescriptionHandlerOptions: {
				constraints: {
					audio: true,
				},
			},
		});
	}
	terminate(session: any, direction: string) {
		if (direction === "outgoing") {
			session.dispose();
		}
		if (direction === "incoming") {
			if (session.state === SessionState.Established) {
				session.bye();
			} else {
				session.reject();
			}
		}
	}

	invite = (sipUri: string) => {
		var targetURI: any = UserAgent.makeURI(
			`sip:${sipUri}@sip-prod.cleverstack.in` //TODO: remove hard coded sip uri
			// `sip:7019@sip-prod.cleverstack.in`
		);

		var spdOptions = {
			earlyMedia: true,
			sessionDescriptionHandlerOptions: {
				constraints: {
					audio: true,
					video: false,
				},
				iceCheckingTimeout: 500,
			},
		};
		if (!this._ua) {
			return;
		}
		const inviter = new Inviter(this._ua, targetURI, spdOptions);
		inviter.invite();

		inviter.stateChange.addListener((state: SessionState) => {
			switch (state) {
				case SessionState.Establishing:
					// this.earlyMedia.play();
					// this.earlyMedia.loop = true;
					console.log("Establishing");
					console.log("inviter", inviter);
					break;
				case SessionState.Established:
					this._getAudioElement(inviter);
					this._onProgress(inviter);
					// this.earlyMedia.pause();
					// this.earlyMedia.currentTime = 0;
					console.log("Established");
					break;
				case SessionState.Terminating:
					console.log("Terminating");
					break;
				case SessionState.Terminated:
					console.log("Terminated");

					this._tarminateSession(inviter);
					break;
				default:
					break;
			}
		});
		this._handleSession(inviter, OUTGOING);
	};

	_getAudioElement = (session: any) => {
		var _docBody = document.getElementsByTagName("body")[0];
		let remoteStream = new MediaStream();

		var audioElement = document.createElement("audio");
		audioElement.className = "mxtech-remote-audio";
		_docBody.appendChild(audioElement);
		session.sessionDescriptionHandler.peerConnection
			.getReceivers()
			.forEach((receiver: any) => {
				if (receiver.track) {
					remoteStream.addTrack(receiver.track);
				}
			});

		const localStream = new MediaStream();

		session.sessionDescriptionHandler.peerConnection
			.getSenders()
			.forEach((sender: any) => {
				if (sender.track) localStream.addTrack(sender.track);
			});

		store.dispatch(
			stateActions.addLocalStream({ sipSession: session, localStream })
		);
		store.dispatch(
			stateActions.addRemoteStream({ sipSession: session, remoteStream })
		);
		if (audioElement) {
			audioElement.srcObject = remoteStream;
			audioElement.play();
		}

		return audioElement;
	};

	cleanupMedia = () => {
		var _docBody = document.getElementsByTagName("body")[0];
		var audioElements = document.getElementsByClassName(
			"mxtech-remote-audio"
		);
		for (var i = 0; i < audioElements.length; i++) {
			_docBody.removeChild(audioElements[i]);
		}
	};

	_handleSession = (sipSession: any, direction: any) => {
		const startTime = Date.now();
		console.log("startTime", sipSession);

		store.dispatch(
			stateActions.addSession({
				sipSession,
				direction,
			})
		);
		const displayName =
			sipSession.remoteIdentity.displayName ||
			sipSession.remoteIdentity.uri.user;
		const sipUri = sipSession.remoteIdentity.uri.toString();

		store.dispatch(
			stateActions.addSessionToHistory({
				displayName: displayName,
				sipUri: sipUri,
				direction: direction,
				startTime: startTime,
			})
		);
	};
	_tarminateSession = (sipSession: any) => {
		this.cleanupMedia();
		store.dispatch(
			requestActions.notify({
				text: `Call terminated: ${sipSession.remoteIdentity.uri.user}`,
			})
		);

		store.dispatch(
			stateActions.setSessionState({
				sipSession: sipSession,
				sessionState: TERMINATED,
			})
		);
		setTimeout(() => {
			store.dispatch(stateActions.removeSession({ sipSession }));
			const sessions = store.getState().sessions;
			if (!store.getState().userStatus.currentSession) {
				if (sessions) {
					store.dispatch(
						stateActions.setCurrentSession({
							currentSession: Object.keys(sessions)[0],
						})
					);
				}
			} else {
				if (sessions) {
					store.dispatch(
						stateActions.setCurrentSession({
							currentSession: null,
						})
					);
				}
			}
		}, 1000);
	};

	_onAccepted = (sipSession: any) => {
		store.dispatch(
			stateActions.setSessionState({
				sipSession,
				sessionState: ACCEPTED,
			})
		);
	};

	_onProgress = (sipSession: any) => {
		sipSession.startTime = Date.now();
		store.dispatch(
			stateActions.setSessionState({
				sipSession,
				sessionState: PROGRESS,
			})
		);
	};

	toggleMyMedia = (sipSession: any) => {
		let muteAudio = sipSession.localStream.getAudioTracks()[0].enabled;
		sipSession.localStream.getAudioTracks()[0].enabled = !muteAudio;
		store.dispatch(
			stateActions.toggleLocalAudio({
				sipSession: sipSession?.sipSession,
			})
		);
	};

	holdCall = (session: any) => {
		var sessionDescriptionHandlerOptions =
			session.sessionDescriptionHandlerOptionsReInvite;
		sessionDescriptionHandlerOptions.hold = true;
		session.sessionDescriptionHandlerOptionsReInvite =
			sessionDescriptionHandlerOptions;
		session.isOnHold = true;

		var options = {
			requestDelegate: {
				onAccept: () => {
					if (
						session &&
						session.sessionDescriptionHandler &&
						session.sessionDescriptionHandler.peerConnection
					) {
						var pc =
							session.sessionDescriptionHandler.peerConnection;

						pc.getReceivers().forEach(function (
							RTCRtpReceiver: any
						) {
							if (RTCRtpReceiver.track)
								RTCRtpReceiver.track.enabled = false;
						});
						pc.getSenders().forEach(function (RTCRtpSender) {
							// Mute Audio
							if (
								RTCRtpSender.track &&
								RTCRtpSender.track.kind === "audio"
							) {
								if (RTCRtpSender.track.IsMixedTrack === true) {
									if (
										session.data.AudioSourceTrack &&
										session.data.AudioSourceTrack.kind ===
											"audio"
									) {
										console.log(
											"Muting Mixed Audio Track : " +
												session.data.AudioSourceTrack
													.label
										);
										session.data.AudioSourceTrack.enabled =
											false;
									}
								}
								console.log(
									"Muting Audio Track : " +
										RTCRtpSender.track.label
								);
								RTCRtpSender.track.enabled = false;
							}
							// Stop Video
							else if (
								RTCRtpSender.track &&
								RTCRtpSender.track.kind === "video"
							) {
								RTCRtpSender.track.enabled = false;
							}
						});
					}
				},
			},
		};

		session.invite(options).catch(function (error) {
			session.isOnHold = false;
			console.warn("Error attempting to put the call on hold:", error);
			store.dispatch(
				stateActions.setSessionState({
					sipSession: session,
					sessionState: HOLD,
				})
			);
		});
		store.dispatch(
			stateActions.toggleRemoteAudio({
				sipSession: session,
			})
		);
	};

	unholdCall = (session: any) => {
		var sessionDescriptionHandlerOptions =
			session.sessionDescriptionHandlerOptionsReInvite;
		sessionDescriptionHandlerOptions.hold = false;
		session.sessionDescriptionHandlerOptionsReInvite =
			sessionDescriptionHandlerOptions;
		var options = {
			requestDelegate: {
				onAccept: function () {
					if (
						session &&
						session.sessionDescriptionHandler &&
						session.sessionDescriptionHandler.peerConnection
					) {
						var pc =
							session.sessionDescriptionHandler.peerConnection;
						// Restore all the inbound streams
						pc.getReceivers().forEach(function (RTCRtpReceiver) {
							if (RTCRtpReceiver.track)
								RTCRtpReceiver.track.enabled = true;
						});
						// Restore all the outbound streams
						pc.getSenders().forEach(function (RTCRtpSender) {
							// Unmute Audio
							if (
								RTCRtpSender.track &&
								RTCRtpSender.track.kind === "audio"
							) {
								if (RTCRtpSender.track.IsMixedTrack === true) {
									if (
										session.data.AudioSourceTrack &&
										session.data.AudioSourceTrack.kind ===
											"audio"
									) {
										console.log(
											"Unmuting Mixed Audio Track : " +
												session.data.AudioSourceTrack
													.label
										);
										session.data.AudioSourceTrack.enabled =
											true;
									}
								}
								console.log(
									"Unmuting Audio Track : " +
										RTCRtpSender.track.label
								);
								RTCRtpSender.track.enabled = true;
							} else if (
								RTCRtpSender.track &&
								RTCRtpSender.track.kind === "video"
							) {
								RTCRtpSender.track.enabled = true;
							}
						});
					}
					session.isOnHold = false;
				},
				onReject: function () {
					session.isOnHold = true;
				},
			},
		};
		session.invite(options).catch(function (error: any) {
			session.isOnHold = true;
		});
		store.dispatch(
			stateActions.toggleRemoteAudio({
				sipSession: session,
			})
		);
	};
}
