import axios from "axios";

const Fetcher = axios.create({
	baseURL: "https://authapi.cleverstack.in/",
});
export default Fetcher;
