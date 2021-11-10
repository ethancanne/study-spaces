import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import allReducers from "./state/reducers";
// import { loadState, saveState } from "./state/localStorage.js";

const persistientState = {};
const store = createStore(allReducers, persistientState, compose(applyMiddleware(thunk)));

// store.subscribe(()=>{
//   saveState(store.getState())
// })

// //STORE - The globalized state for our app

// //ACTION - Describes what you want to do with the state
// const increment = () => {
//   return {
//     type: "INCREMENT"
//   };
// };
// const decrement = () => {
//   return {
//     type: "DECREMENT"
//   };
// };

// //REDUCER - How your actions transform the state into the next state
// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case "INCREMENT":
//       return state + 1;

//     case "DECREMENT":
//       return state - 1;
//   }
// };

// let store = createStore(counter);

// store.subscribe(() => console.log(store.getState()));

// //DISPATCH - Send the action to the reducer to finally update the store
// store.dispatch(increment());
// store.dispatch(increment());
// store.dispatch(increment());
// store.dispatch(decrement());

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
