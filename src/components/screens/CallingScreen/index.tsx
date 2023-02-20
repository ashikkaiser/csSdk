import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import cn from "classnames";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContect";
import { CallEndIcon, CallIcon } from "../../icons";
import "./index.scss";

type CallingScreenProps = {
	callType: "incoming" | "outgoing";
	currentCall: any;
};

export default function CallingScreen({
	callType,
	currentCall,
}: CallingScreenProps) {
	const { sipCaller } = useContext(AuthContext);
	const displayName =
		currentCall?.sipSession.remoteIdentity.displayName ||
		currentCall?.sipSession.remoteIdentity.uri.user;

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
							{displayName}
						</span>
						<span className="cs-calling-content-info-number">
							{displayName}
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
									sipCaller.terminate(
										currentCall?.sipSession,
										callType
									)
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
							<span
								onClick={() => {
									sipCaller.accept(currentCall?.sipSession);
								}}>
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
