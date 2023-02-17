import { withSnackbar } from "notistack";
import { Component } from "react";
import { connect } from "react-redux";
import * as stateActions from "../../redux/actions/stateActions";
interface Props {
	notifications: any;
	enqueueSnackbar: any;
	removeNotification: any;
}

class Notifications extends Component<Props> {
	displayed!: any[];
	storeDisplayed = (id: any) => {
		this.displayed = [...this.displayed, id];
	};

	shouldComponentUpdate({ notifications: newNotifications }: any) {
		const { notifications: currentNotifications } = this.props;

		let notExists = false;

		for (let i = 0; i < newNotifications.length; i += 1) {
			if (notExists) continue;

			notExists =
				notExists ||
				currentNotifications.filter(
					(id: any) => newNotifications[i]?.id === id
				).length;
		}

		return notExists;
	}

	componentDidUpdate() {
		const { notifications = [] } = this.props;

		notifications.forEach(
			(notification: {
				id: string;
				text: any;
				type: any;
				timeout: any;
			}) => {
				// Do nothing if snackbar is already displayed
				if (this.displayed.includes(notification.id)) return;
				// Display snackbar using notistack
				this.props.enqueueSnackbar(notification.text, {
					variant: notification.type,
					autoHideDuration: notification.timeout,
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "left",
					},
				});
				// Keep track of snackbars that we've displayed
				this.storeDisplayed(notification.id);
				// Dispatch action to remove snackbar from redux store
				this.props.removeNotification(notification.id);
			}
		);
	}

	render() {
		return null;
	}
}

// Notifications.propTypes = {
// 	notifications: PropTypes.array.isRequired,
// 	enqueueSnackbar: PropTypes.func.isRequired,
// 	removeNotification: PropTypes.func.isRequired,
// };

const mapStateToProps = (state: any) => ({
	notifications: state.notifications,
});

const mapDispatchToProps = (dispatch: any) => ({
	removeNotification: (notificationId: any) =>
		dispatch(stateActions.removeNotification(notificationId)),
});

export default withSnackbar(
	connect(mapStateToProps, mapDispatchToProps)(Notifications)
);
