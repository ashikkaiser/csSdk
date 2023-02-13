import { Card } from "antd";
import cn from "classnames";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContect";
import DialPad from "../dialpad";
import { PhoneDrawer } from "../Drawer";
import { CrossIcon, TowerIcon } from "../icons";
import { InitialScreen, ActiveCallScreen } from "../screens";
import "./index.scss";
// import SipPhone from "../../sipjs/Phone";
type WidgetProps = {
	minimize?: boolean;
};

export function Widget({ minimize }: WidgetProps) {
	const [register, setRegister] = useState(true);
	const [openDrawer, setOpenDrawer] = useState(false);
	const { user, login, logout } = useContext(AuthContext);

	const [diallingNumber, setDiallingNumber] = useState("");
	console.log(user);
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
							"cs-header--register": register,
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
						<InitialScreen
							setOpenDrawer={setOpenDrawer}
							user={user}
						/>
						{/* <CallingScreen callType="incoming" /> */}
						{/* <ActiveCallScreen /> */}
					</div>

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
