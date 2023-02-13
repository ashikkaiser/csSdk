import "./index.scss";
import cn from "classnames";
import openLauncher from "../assets/launcher_button.svg";
import "antd/dist/reset.css";
import { Button } from "antd";
import { FloatButton } from "antd";
import { useContext, useState } from "react";
import Luncher from "./luncher";
import { Widget } from "./widget";
import AuthContextProvider from "../context/AuthContect";
import SipPhoneProvider, { SipPhoneContext } from "../sipjs/Phone";

type PhoneProps = {
	openImg?: string;
};

const Phone = ({}: PhoneProps) => {
	const [minimize, setMinimize] = useState(true);
	const { sipPhone } = useContext(SipPhoneContext);

	console.log(sipPhone);

	return (
		<AuthContextProvider>
			<SipPhoneProvider>
				<div
					className="cs-phone"
					style={{
						backgroundColor: "red",
					}}>
					<Luncher minimize={minimize} setMinimize={setMinimize} />
					{!minimize && <Widget minimize={minimize} />}
				</div>
			</SipPhoneProvider>
		</AuthContextProvider>
	);
};

export default Phone;
