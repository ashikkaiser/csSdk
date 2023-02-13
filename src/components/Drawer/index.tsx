import { Drawer, Space } from "antd";
import { CrossIcon } from "../icons";
import "./index.scss";
type PhoneDrawerProps = {
	openDrawer: boolean;
	setOpenDrawer: (openDrawer: boolean) => void;
	component: JSX.Element;
	title?: string;
};

export const PhoneDrawer = ({
	openDrawer,
	setOpenDrawer,
	component,
	title,
}: PhoneDrawerProps) => {
	return (
		<Drawer
			height={"90%"}
			title={
				<Space
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "#757575",
					}}>
					<CrossIcon
						onClick={() => setOpenDrawer(false)}
						height="15px"
						style={{
							cursor: "pointer",
							position: "absolute",
							left: "10px",
							top: "5px",
							color: "#757575",
						}}
						color="#757575"
					/>
					<span>{title}</span>
				</Space>
			}
			headerStyle={{
				backgroundColor: "#fff",
				color: "#fff",
				fontSize: "20px",
				fontWeight: "bold",
				padding: "5px 10px",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				border: "none",
				position: "relative",
			}}
			bodyStyle={{
				padding: "5px 10px",
				border: "none",
			}}
			placement="bottom"
			closable={false}
			onClose={() => setOpenDrawer(false)}
			open={openDrawer}
			style={{
				border: "none",
				borderRadius: "10px 10px 0px 0px",
			}}
			getContainer={false}>
			<div className="cs-drawer-container">{component}</div>
		</Drawer>
	);
};
