import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./index.scss";
import {
	CallEndIcon,
	ContactAddIcon,
	ContactIcon,
	DialPadIcon,
	HoldIcon,
	MicIcon,
	MoreIcon,
	MuteIcon,
	NoteIcon,
	RecordIcon,
	TagIcon,
	TransfarIcon,
	UnHoldIcon,
} from "../../icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContect";

const ActiveCallScreen = ({ currentCall, callType, setOpenDrawer }) => {
	const { sipCaller } = useContext(AuthContext);
	const [callDuration, setCallDuration] = useState("00:00");
	const displayName =
		currentCall?.sipSession.remoteIdentity.displayName ||
		currentCall?.sipSession.remoteIdentity.uri.user;

	useEffect(() => {
		const interval = setInterval(() => {
			const startTime = new Date(currentCall?.sipSession?.startTime);
			const runningTime = new Date().getTime() - startTime.getTime();
			let timer = 0;
			let minutes: any = Math.floor(runningTime / (60 * 1000));
			let hours: any = Math.floor(minutes / 60);
			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			timer = runningTime - minutes * 60 * 1000;
			let seconds: any = Math.floor(timer / 1000);
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			setCallDuration(hours + ":" + minutes + ":" + seconds);
		}, 1000);
		return () => clearInterval(interval);
	}, [currentCall]);

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
						<span className="cs-calling-content-info-number">
							{callDuration}
						</span>
					</div>

					<div className="cs-calling-options_buttons">
						<div
							className="cs-calling-options_buttons__button_group"
							onClick={() => {
								sipCaller?.toggleMyMedia(currentCall);
							}}>
							{currentCall?.localAudioMuted ? (
								<>
									<MuteIcon
										color="#fff"
										height="25px"
										width="25px"
									/>
									<span className="cs-calling-options_buttons__button_group__text">
										Unmute
									</span>
								</>
							) : (
								<>
									<MicIcon
										color="#fff"
										height="25px"
										width="25px"
									/>
									<span className="cs-calling-options_buttons__button_group__text">
										Mute
									</span>
								</>
							)}
						</div>
						<div
							className="cs-calling-options_buttons__button_group"
							onClick={() => {
								currentCall?.sipSession?.isOnHold
									? sipCaller?.unholdCall(
											currentCall?.sipSession
									  )
									: sipCaller?.holdCall(
											currentCall?.sipSession
									  );
							}}>
							{!currentCall?.remoteAudioMuted ? (
								<>
									<HoldIcon
										color="#fff"
										height="25px"
										width="28px"
									/>
									<span className="cs-calling-options_buttons__button_group__text">
										Hold
									</span>
								</>
							) : (
								<>
									<UnHoldIcon
										color="#fff"
										height="25px"
										width="28px"
									/>
									<span className="cs-calling-options_buttons__button_group__text">
										UnHold
									</span>
								</>
							)}
						</div>
						<div
							className="cs-calling-options_buttons__button_group"
							onClick={() => {
								setOpenDrawer(true);
							}}>
							<DialPadIcon
								color="#fff"
								height="24px"
								width="24px"
							/>
							<span className="cs-calling-options_buttons__button_group__text">
								Dial Pad
							</span>
						</div>
						<div className="cs-calling-options_buttons__button_group">
							<RecordIcon
								color="#fff"
								height="24px"
								width="24px"
							/>
							<span className="cs-calling-options_buttons__button_group__text">
								Record
							</span>
						</div>
					</div>

					<div className="cs-calling-options-details_buttons">
						<div className="cs-calling-options-details_buttons__button_group">
							<NoteIcon
								color="#c1bebe"
								height="24px"
								width="24px"
							/>
							<span className="cs-calling-options-details_buttons__button_group__text">
								Notes
							</span>
						</div>
						<div className="cs-calling-options-details_buttons__button_group">
							<TagIcon
								color="#c1bebe"
								height="24px"
								width="24px"
							/>
							<span className="cs-calling-options-details_buttons__button_group__text">
								Tags
							</span>
						</div>
						<div className="cs-calling-options-details_buttons__button_group">
							<ContactIcon
								color="#c1bebe"
								height="24px"
								width="24px"
							/>
							<span className="cs-calling-options-details_buttons__button_group__text">
								Contact
							</span>
						</div>
					</div>

					<div className="cs-calling-options-footer-buttons">
						<div className="cs-calling-options_buttons">
							<div
								className="cs-calling-options-buttons__button_group__reject"
								onClick={() => {
									sipCaller.terminate(
										currentCall?.sipSession,
										callType
									);
								}}>
								<CallEndIcon
									viewBox="0 0 24 24"
									color="#fff"
									height="40"
									width="40"
								/>
							</div>
							<div className="cs-calling-options_buttons__button_group">
								<ContactAddIcon height="25px" width="25px" />
								<span className="cs-calling-options_buttons__button_group__text">
									Add
								</span>
							</div>
							<div className="cs-calling-options_buttons__button_group">
								<TransfarIcon height="25px" width="28px" />
								<span className="cs-calling-options_buttons__button_group__text">
									Transfer
								</span>
							</div>
							<div className="cs-calling-options_buttons__button_group">
								<MoreIcon height="25px" width="28px" />
								<span className="cs-calling-options_buttons__button_group__text">
									More
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActiveCallScreen;
