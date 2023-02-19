import {
	ACCEPTED,
	INCOMING,
	OUTGOING,
	PROGRESS,
	TERMINATED,
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

		//registerer.register();
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
		console.log("reject", session);
		console.log("direction", direction);
		if (direction === "outgoing") {
			session.dispose();
		}
		if (direction === "incoming") {
			console.log("reject", session);
			if (session.state === SessionState.Established) {
				session.bye();
			} else {
				session.reject();
			}
		}
	}

	invite = (sipUri: string) => {
		var targetURI: any = UserAgent.makeURI(
			// `sip:${destination}@sip-prod.cleverstack.in`
			//TODO: remove hard coded sip uri
			`sip:7019@sip-prod.cleverstack.in`
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
					console.log("Establishing");
					console.log("inviter", inviter);
					break;
				case SessionState.Established:
					this._getAudioElement(inviter);
					this._onProgress(inviter);
					this.earlyMedia.play();
					this.earlyMedia.loop = true;
					console.log("Established");
					break;
				case SessionState.Terminating:
					console.log("Terminating");
					break;
				case SessionState.Terminated:
					console.log("Terminated");
					this.earlyMedia.pause();
					this.earlyMedia.currentTime = 0;
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
				console.log(receiver);
				if (receiver.track) {
					remoteStream.addTrack(receiver.track);
				}
			});
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
		store.dispatch(
			stateActions.setSessionState({
				sipSession,
				sessionState: PROGRESS,
			})
		);
	};

	holdCall = (sipSession: any) => {
		sipSession.hold();
	};
	muteCall = (sipSession: any) => {
		sipSession.mute();
	};
	unmuteCall = (sipSession: any) => {
		sipSession.unmute();
	};
	unholdCall = (sipSession: any) => {
		sipSession.unhold();
	};
}
