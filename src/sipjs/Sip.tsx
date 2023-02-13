import {
	InvitationAcceptOptions,
	Referral,
	Session,
	SessionState,
} from "sip.js";

export const _getAudioElement = (session: any) => {
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

export const cleanupMedia = () => {
	var _docBody = document.getElementsByTagName("body")[0];
	var audioElements = document.getElementsByClassName("mxtech-remote-audio");
	for (var i = 0; i < audioElements.length; i++) {
		_docBody.removeChild(audioElements[i]);
	}
};

export const inviterStateChange = (inviter: any) => {
	inviter.stateChange.addListener((state: SessionState) => {
		switch (state) {
			case SessionState.Establishing:
				console.log("Establishing");
				break;
			case SessionState.Established:
				_getAudioElement(inviter);
				console.log("Established");
				break;
			case SessionState.Terminating:
				console.log("Terminating");
				break;
			case SessionState.Terminated:
				cleanupMedia();
				break;
			default:
				break;
		}
	});

	inviter.delegate = {
		onAccept: (session: any) => {
			console.log("onAccept", session);
		},
		onProgress: (session: any) => {
			console.log("onProgress", session);
		},
		onReject: (session: any) => {
			console.log("onReject", session);
		},
		onRedirect: (session: any) => {
			console.log("onRedirect", session);
		},
		onTrying: (session: any) => {
			console.log("onInfo", session);
		},
	};
	console.log(inviter);
};

export const incomingSession = (session: any) => {
	const incomingSession = session;

	console.log(incomingSession);

	// Setup incoming session delegate
	incomingSession.delegate = {
		// Handle incoming REFER request.
		onBye: (session: any) => {
			console.log("onBye", session);
		},
	};

	// Handle incoming session state changes.
	incomingSession.stateChange.addListener((newState: SessionState) => {
		switch (newState) {
			case SessionState.Establishing:
				// Session is establishing.
				console.log("Establishing");
				break;
			case SessionState.Established:
				// Session has been established.
				console.log("Established");
				break;
			case SessionState.Terminated:
				// Session has terminated.
				console.log("Terminated");
				break;
			default:
				break;
		}
	});
};
