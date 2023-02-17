import "./index.scss";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContect";
import { CallIcon, ClearIcon } from "../icons";

type DialPadProps = {
	diallingNumber: string;
	setDiallingNumber: (diallingNumber: string) => void;
	minimize: boolean;
};

export default function DialPad({
	diallingNumber,
	setDiallingNumber,
	minimize,
}: DialPadProps) {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"];
	const { sipCaller } = useContext(AuthContext);

	// console.log("diallingNumber", sipCaller);

	const handleKeyDown = (e: any) => {
		if (e.key === "Backspace") {
			setDiallingNumber(diallingNumber.slice(0, -1));
		} else if (e.key === "Enter") {
			// call();
		} else if (e.key === "Escape") {
			// hangup();
		} else if (e.key === "1") {
			setDiallingNumber(diallingNumber + "1");
		} else if (e.key === "2") {
			setDiallingNumber(diallingNumber + "2");
		} else if (e.key === "3") {
			setDiallingNumber(diallingNumber + "3");
		} else if (e.key === "4") {
			setDiallingNumber(diallingNumber + "4");
		} else if (e.key === "5") {
			setDiallingNumber(diallingNumber + "5");
		} else if (e.key === "6") {
			setDiallingNumber(diallingNumber + "6");
		} else if (e.key === "7") {
			setDiallingNumber(diallingNumber + "7");
		} else if (e.key === "8") {
			setDiallingNumber(diallingNumber + "8");
		} else if (e.key === "9") {
			setDiallingNumber(diallingNumber + "9");
		} else if (e.key === "0") {
			setDiallingNumber(diallingNumber + "0");
		} else if (e.key === "*") {
			setDiallingNumber(diallingNumber + "*");
		} else if (e.key === "#") {
			setDiallingNumber(diallingNumber + "#");
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	};
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [diallingNumber, minimize]);

	return (
		<div className="cs-dial-pad">
			<div className="cs-dial-pad__input">{diallingNumber}</div>

			<div className="cs-dial-pad__buttons">
				{numbers.map((item, index) => {
					return (
						<div
							onClick={() => {
								setDiallingNumber(diallingNumber + item);
							}}
							className="cs-dial-pad__button"
							key={index}>
							<span>{item}</span>
						</div>
					);
				})}
			</div>
			<div className="cs-dial-pad__footer">
				<div className="cs-dial-pad__footer__button_empty"></div>
				<div
					className="cs-dial-pad__footer__button_call"
					onClick={() => {
						// call();
						sipCaller.invite(diallingNumber);
					}}>
					<span>
						<CallIcon color="white" height="25px" width="25px" />
					</span>
				</div>
				<div
					className="cs-dial-pad__footer__button_clear_icon"
					onClick={() => {
						setDiallingNumber(diallingNumber.slice(0, -1));
					}}>
					<ClearIcon color="#757575" height="25px" width="25px" />
				</div>
			</div>
		</div>
	);
}
