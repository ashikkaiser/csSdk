const HoldIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"
			style={{
				fill: color,
			}}
		/>
	</svg>
);

export default HoldIcon;
