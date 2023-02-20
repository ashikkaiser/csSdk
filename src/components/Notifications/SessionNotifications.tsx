import { useContext } from "react";
import { connect } from "react-redux";
import "./index.scss";
import { AuthContext } from "../../context/AuthContect";
import { withSipCallerContext } from "../../context/SipCallerContext";
import * as sessionStates from "../../sipjs/SessionStates";
import { CallEndIcon, CallIcon } from "../icons";

const SessionNotifications = (props: any) => {
	const { incomingSessions } = props;
	const { sipCaller } = useContext<any>(AuthContext);

	return (
		<div>
			{incomingSessions.map((session: any) => {
				return (
					<div className="cs-notification" key={session.id}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<div style={{}}>
								<div className="cs-notification__name">
									Incoming call
								</div>
								<div className="cs-notification__number">
									{session.sipSession.remoteIdentity
										.displayName ||
										session.sipSession.remoteIdentity.uri
											.user}
								</div>
							</div>

							<div className="cs-notification__action">
								<div className="cs-notification__action__accept">
									<CallIcon
										color="white"
										height="25px"
										width="25px"
										onClick={() =>
											sipCaller.accept(session.sipSession)
										}
									/>
								</div>
								<div className="cs-notification__action__reject">
									<CallEndIcon
										color="white"
										height="25px"
										width="25px"
										onClick={() =>
											sipCaller.terminate(
												incomingSessions[0].id
											)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	incomingSessions: Object.values(state.sessions).filter(
		(session: any) =>
			session.sessionState === sessionStates.NEW &&
			session.direction === sessionStates.INCOMING
	),
});

export default withSipCallerContext(
	connect(mapStateToProps, null)(SessionNotifications)
);
