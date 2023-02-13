const ContactAddIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4zm2 2v2h3v3h2v-3h3v-2h-3V7h-2v3h-3zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z"
			style={{
				fill: color,
			}}></path>
	</svg>
);

export default ContactAddIcon;
