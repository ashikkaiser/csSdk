import { DialPadIcon } from "../../icons";
import "./index.scss";

type InitialScreenProps = {
	setOpenDrawer: (openDrawer: boolean) => void;
	user?: any;
};

const InitialScreen = ({ setOpenDrawer, user }: InitialScreenProps) => {
	return (
		<>
			<div className="cs-greeting">
				<div className="cs-greeting__title">
					<span>Greetings, </span>
					<span>{user?.user?.name}</span>
				</div>
			</div>

			<div className="cs-initial-body">
				<div className="cs-initial-body__title">
					<span>Welcome to Cleverstack</span>
				</div>
				<div className="cs-initial-body__subtitle">
					<span>Cloud Telephony</span>
				</div>
			</div>
			<div
				onClick={() => setOpenDrawer(true)}
				className="cs-dialpad-button">
				<DialPadIcon
					viewBox="0 0 24 24"
					height="40px"
					width="28px"
					color="#fff"
				/>
			</div>
		</>
	);
};

export default InitialScreen;
