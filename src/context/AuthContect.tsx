import { createContext, useEffect, useState } from "react";
import Fetcher from "../hooks/CustomAxios";
import SipCaller from "../sipjs/SipPhone";
import SipCallerContext from "./SipCallerContext";

import { store } from "../utils/store";
import { message } from "antd";

type AuthContextType = {
	user: string | null;
	login: (user: string) => void;
	logout: () => void;
	callingInfo: any;
	sipCaller: any;
};
export const AuthContext = createContext<AuthContextType>({
	user: null,
	login: () => {},
	logout: () => {},
	callingInfo: null,
	sipCaller: null,
});
let sipCaller: any = null;
let global: any = {};
global.sipCaller = sipCaller;

const AuthContextProvider = (props: any) => {
	const [user, setUser] = useState<string | null>(null);
	const [callingInfo, setCallingInfo] = useState<any>(null);
	const getUser = async () => {
		try {
			const { data } = await Fetcher.get(
				`api/auth/calling_info/?user_id=${props.user_id}`,
				{
					headers: { Authorization: `${props.apiKey}` },
				}
			);
			setUser(data.data);
			setCallingInfo(data?.data?.calling_information);
		} catch (e: any) {
			message && message.error("Authentication failed");
		}
	};

	useEffect(() => {
		if (callingInfo) {
			store.dispatch({
				type: "SET_USER",
				payload: {
					displayName: "Ashik Kaiser",
					user: callingInfo?.sip_username,
					sipUri: callingInfo?.sip_username,
					password: callingInfo?.sip_password || 1234,
					wssServer: "sip-prod.cleverstack.in",
					autoRegister: true,
				},
			});
			SipCaller.init({ store });
			sipCaller = new SipCaller();
		}
	}, [callingInfo]);

	const login = (user: string) => {
		setUser(user);
	};

	const logout = () => {
		setUser(null);
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, login, logout, callingInfo, sipCaller }}>
			{user && (
				<SipCallerContext.Provider value={sipCaller}>
					{props.children}
				</SipCallerContext.Provider>
			)}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
