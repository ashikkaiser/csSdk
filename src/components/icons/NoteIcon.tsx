const NoteIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M19 5v9h-5v5H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10l6-6V5c0-1.1-.9-2-2-2zm-7 11H7v-2h5v2zm5-4H7V8h10v2z"
			style={{
				fill: color,
			}}
		/>
	</svg>
);

export default NoteIcon;
