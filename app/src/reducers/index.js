// ./src/reducers/index.js
import { combineReducers } from "redux";
import menus from "./menus";

export default combineReducers({
  menus: menus
  // More reducers if there are
  // can go here
});
