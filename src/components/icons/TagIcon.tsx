const TagIcon = ({ color = "#f5f5f5", ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		xmlSpace="preserve"
		width="19px"
		height="19px"
		fontSize="1.5rem"
		{...rest}>
		<path
			d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"
			style={{
				fill: color,
			}}></path>
		<path
			d="M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
			style={{
				fill: color,
			}}></path>
	</svg>
);

export default TagIcon;
