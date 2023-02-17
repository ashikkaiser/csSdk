import React from "react";

const SipCallerContext = React.createContext(null);

export default SipCallerContext;

export const withSipCallerContext = (Component: any) => {
	return (props: any) => (
		<SipCallerContext.Consumer>
			{(sipCaller) => <Component {...props} sipCaller={sipCaller} />}
		</SipCallerContext.Consumer>
	);
};
