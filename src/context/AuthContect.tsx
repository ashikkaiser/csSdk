import { createContext, useEffect, useState } from "react";
import Fetcher from "../hooks/CustomAxios";

type AuthContextType = {
	user: string | null;
	login: (user: string) => void;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	login: () => {},
	logout: () => {},
});

const AuthContextProvider = ({ children }: any) => {
	const [user, setUser] = useState<string | null>(null);
	// const { data, loading, error } = useAxios(
	// 	"authapi.cleverstack.in/api/auth/calling_info/?user_id=8"
	// );

	const getUser = async () => {
		try {
			const { data } = await Fetcher.get(
				"api/auth/calling_info/?user_id=8"
			);
			setUser(data.data);
		} catch (e) {
			console.log(e);
		}
	};

	const login = (user: string) => {
		setUser(user);
	};

	const logout = () => {
		setUser(null);
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
