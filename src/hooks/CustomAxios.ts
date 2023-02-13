import axios from "axios";

const Fetcher = axios.create({
	baseURL: "https://authapi.cleverstack.in/",
});

Fetcher.interceptors.request.use(async (req) => {
	const access_token = "15543d6899f8d79f";
	req.headers.Authorization = `${access_token}`;
	return req;
});

export default Fetcher;
