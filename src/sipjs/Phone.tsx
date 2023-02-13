import {
	Inviter,
	SessionState,
	UserAgent,
	Registerer,
	InviterOptions,
	Session,
	Referral,
	RegistererState,
} from "sip.js";

import { createContext, useEffect, useState } from "react";
import {
	cleanupMedia,
	incomingSession,
	inviterStateChange,
	_getAudioElement,
} from "./Sip";

type SipPhoneContextType = {
	sipPhone: any;
	invite: (destination: string) => void;
};

export const SipPhoneContext = createContext<SipPhoneContextType>({} as any);

const SipPhoneProvider = ({ children }: any) => {
	const [registered, setRegistered] = useState(false);
	const [callSession, setCallSession] = useState(null);

	const options = {
		uri: UserAgent.makeURI("sip:7018@sip-prod.cleverstack.in"),
		authorizationUsername: "7018",
		authorizationPassword: "Admin@5678",

		transportOptions: {
			server: "wss://sip-prod.cleverstack.in:7443",
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
			onInvite: (session: any) => {
				incomingSession(session);
			},
			onBye: (session: any) => {
				console.log("onBye", session);
			},
		},
	};
	let sipPhone: any = new UserAgent(options);
	const registerer = new Registerer(sipPhone);
	sipPhone.start().then(() => {
		registerer.register().then(() => {});
	});

	useEffect(() => {
		registerer.stateChange.addListener((state: any) => {
			if (state === RegistererState.Registered) {
				if (!registered) {
					setRegistered(true);
					console.log("registered");
				}
			} else {
				console.log("unregistered");
				setRegistered(false);
			}
		});
	}, [registerer]);

	const invite = (destination: string) => {
		var targetURI: any = UserAgent.makeURI(
			// `sip:${destination}@sip-prod.cleverstack.in`
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
		const inviter = new Inviter(sipPhone, targetURI, spdOptions);
		inviterStateChange(inviter);
		inviter.invite().then((res) => {
			console.log(res);
		});
	};
	return (
		<SipPhoneContext.Provider value={{ sipPhone, invite }}>
			{children}
		</SipPhoneContext.Provider>
	);
};

export default SipPhoneProvider;
