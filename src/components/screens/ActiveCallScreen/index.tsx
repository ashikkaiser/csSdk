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
	NoteIcon,
	RecordIcon,
	TagIcon,
	TransfarIcon,
} from "../../icons";

const ActiveCallScreen = () => {
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
						<span className="cs-calling-content-info-number">
							0.001
						</span>
					</div>

					<div className="cs-calling-options_buttons">
						<div className="cs-calling-options_buttons__button_group">
							<MicIcon color="#fff" height="25px" width="25px" />
							<span className="cs-calling-options_buttons__button_group__text">
								Mute
							</span>
						</div>
						<div className="cs-calling-options_buttons__button_group">
							<HoldIcon color="#fff" height="25px" width="28px" />
							<span className="cs-calling-options_buttons__button_group__text">
								Hold
							</span>
						</div>
						<div className="cs-calling-options_buttons__button_group">
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
							<div className="cs-calling-options-buttons__button_group__reject">
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
