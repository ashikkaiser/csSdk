import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../redux/reducers/rootReducer";

// initial states here
const initalState = {};

// middleware
const middleware = [thunk];
export const store = createStore(
	rootReducer,
	initalState,
	composeWithDevTools(applyMiddleware(...middleware))
);

// assigning store to next wrapper
const makeStore = () => store;

export default makeStore;
