import { FloatButton } from "antd";
type LuncherProps = {
	openImg?: string;
	minimize?: boolean;
	setMinimize: (minimize: boolean) => void;
};

export default function Luncher({ minimize, setMinimize }: LuncherProps) {
	return (
		<FloatButton
			className="launcher"
			onClick={() => setMinimize(!minimize)}
		/>
	);
}
