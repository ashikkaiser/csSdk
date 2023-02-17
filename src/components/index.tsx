import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import AuthContextProvider from "../context/AuthContect";
import { store } from "../utils/store";
import "./index.scss";
import Luncher from "./luncher";
import SessionNotifications from "./Notifications/SessionNotifications";
import { Widget } from "./widget";

type PhoneProps = {
	apiKey: string;
	user_id: string;
};
// Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)

const Phone = ({ user_id, apiKey }: PhoneProps) => {
	const [minimize, setMinimize] = useState(true);

	return (
		<Provider store={store}>
			<AuthContextProvider apiKey={apiKey} user_id={user_id}>
				<SessionNotifications />
				<div
					className="cs-phone"
					style={{
						backgroundColor: "red",
					}}>
					<Luncher minimize={minimize} setMinimize={setMinimize} />
					{!minimize && <Widget minimize={minimize} />}
				</div>
			</AuthContextProvider>
		</Provider>
	);
};

export default Phone;
