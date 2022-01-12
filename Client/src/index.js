import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import allReducers from "./state/reducers";

import Validator from "../../Server/Validator.js";

const persistientState = {};
const reduxDevToolsAreInstalled =
    Validator.isDefined(window.__REDUX_DEVTOOLS_EXTENSION__) &&
    Validator.isDefined(window.__REDUX_DEVTOOLS_EXTENSION__());
export const store = reduxDevToolsAreInstalled
    ? createStore(
          allReducers,
          persistientState,
          compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
      )
    : createStore(allReducers, persistientState);

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);
