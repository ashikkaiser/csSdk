import { Card } from "antd";
import cn from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSound from "use-sound";
import { AuthContext } from "../../context/AuthContect";
import useAudio from "../../hooks/useAudio";
import {
	ACCEPTED,
	INCOMING,
	NEW,
	OUTGOING,
	PROGRESS,
	TERMINATED,
} from "../../sipjs/SessionStates";
import DialPad from "../dialpad";
import { PhoneDrawer } from "../Drawer";
import { CrossIcon, TowerIcon } from "../icons";
import { ActiveCallScreen, CallingScreen, InitialScreen } from "../screens";
import "./index.scss";
// type WidgetProps = {
// 	minimize?: boolean;
// };
export function Widget({ minimize }) {
	const [openDrawer, setOpenDrawer] = useState(false);
	const store = useSelector((state) => state);
	const { user } = useContext(AuthContext);
	const [diallingNumber, setDiallingNumber] = useState("");
	const [currentCall, setCurrentCall] = useState({})
	// const [playing, toggle] = useAudio("./../media/EarlyMedia.mp3");
	///play sound fucntion here 
	// const playSound = () => {
	// 	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// 	const context = new AudioContext();
	// 	const audio = new Audio("./../media/EarlyMedia.mp3");
	// 	const source = context.createMediaElementSource(audio);
	// 	const gainNode = context.createGain();
	// 	source.connect(gainNode);
	// 	gainNode.connect(context.destination);
	// 	gainNode.gain.value = 0.5;
	// 	audio.play();

	// 	console.log(audio);

	// };




	const { userStatus, sessions } = store;
	useEffect(() => {
		if (userStatus?.currentSession) {
			setCurrentCall(sessions[userStatus.currentSession]);
		} else {
			setCurrentCall(null);
		}
	}, [store, minimize]);

	const callIsRunning = () => {
		switch (currentCall?.sessionState) {
			case NEW:
				return false;
			case PROGRESS:
				return true;
			case ACCEPTED:
				return true;
			case TERMINATED:
				return false;
			default:
				return false;
		}
	};

	const callIsIncoming =
		sessions[userStatus?.currentSession]?.direction === INCOMING;
	const callIsOutgoing =
		sessions[userStatus?.currentSession]?.direction === OUTGOING;
	useEffect(() => {
		if (currentCall) {
			setOpenDrawer(false);
		}

	}, [currentCall]);



	return (
		<div
			className="cs-widget"
			style={{
				height: minimize ? 0 : "auto",
				width: minimize ? 0 : "auto",
				boxShadow: "0 9.5px 12.7px 0 rgb(0 0 0 / 5%)",
				borderRadius: "10px",
			}}>
			<div className="cs-container">
				<Card
					style={{
						width: 270,
						padding: 0,
					}}
					bodyStyle={{
						padding: 0,
					}}
					bordered={false}
					hidden={minimize}>
					<div
						className={cn("cs-header", {
							"cs-header--register": userStatus?.registered,
						})}>
						<span>0.38</span>
						<span>Personal Line</span>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "2px",
							}}>
							<span>
								<TowerIcon height="15px" color="#22c368" />
							</span>

							<span onClick={() => setOpenDrawer(false)}>
								<CrossIcon height="15px" />
							</span>
						</div>
					</div>

					<div className="cs-body">
						{callIsRunning() ? (
							<ActiveCallScreen />
						) : (
							<div>
								{callIsIncoming || callIsOutgoing ? (
									<CallingScreen
										sipSession={currentCall?.sipSession}
										callType={
											callIsIncoming
												? "incoming"
												: "outgoing"
										}
									/>
								) : (
									<InitialScreen
										setOpenDrawer={setOpenDrawer}
										user={user}
									/>
								)}
							</div>
						)}

						{/* <ActiveCallScreen /> */}
					</div>

					{/* {} */}

					<PhoneDrawer
						openDrawer={openDrawer}
						setOpenDrawer={setOpenDrawer}
						title="DialPad"
						component={
							<DialPad
								diallingNumber={diallingNumber}
								setDiallingNumber={setDiallingNumber}
								minimize={minimize || false}
							/>
						}
					/>
				</Card>
			</div>
		</div>
	);
}
