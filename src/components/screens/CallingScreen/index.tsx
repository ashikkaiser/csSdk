import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import cn from "classnames";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContect";
import { CallEndIcon, CallIcon } from "../../icons";
import "./index.scss";

type CallingScreenProps = {
	callType: "incoming" | "outgoing";
	sipSession: any;
};

export default function CallingScreen({
	callType,
	sipSession,
}: CallingScreenProps) {
	const { sipCaller } = useContext(AuthContext);

	return (
		<div>
			<div className="cs-calling-body">
				<div className="cs-calling-content">
					<div className="cs-calling-content__avatar">
						<Avatar
							size={64}
							icon={<UserOutlined />}
							className="cs-calling-content-avatar-img"
						/>
					</div>
					<div className="cs-calling-content-info">
						<span className="cs-calling-content-info-name">
							Md Ashik Kaiser
						</span>
						<span className="cs-calling-content-info-number">
							+880 1711 111 111
						</span>
					</div>
				</div>

				<div className="cs-calling-footer">
					<div className="cs-calling-footer-buttons">
						<div
							className={cn("cs-calling-footer__button-reject", {
								"cs-calling-footer__button-fix-margin":
									callType === "outgoing",
							})}>
							<span
								onClick={() =>
									sipCaller.terminate(sipSession, callType)
								}>
								<CallEndIcon
									height="25px"
									color="#fff"
									width="25px"
								/>
							</span>
						</div>
						<div
							className={cn("cs-calling-footer__button-answer", {
								"cs-calling-footer__button-answer--outgoing":
									callType === "outgoing",
							})}>
							<span onClick={() => sipCaller.accept(sipSession)}>
								<CallIcon
									height="25px"
									color="#fff"
									width="25px"
								/>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
