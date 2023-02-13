const TowerIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 20"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M2 22h20V2L2 22z"
			style={{
				fill: color,
			}}
		/>
	</svg>
);

export default TowerIcon;
