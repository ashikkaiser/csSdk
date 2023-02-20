const UnHoldIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
			style={{
				fill: color,
			}}
		/>
	</svg>
);

export default UnHoldIcon;
