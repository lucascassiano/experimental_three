import React, { Component } from "react";
import Toolbar from "react-minimalist-toolbar";
import {} from "../styles/Menus.css";

//redux
import { connect } from "react-redux";
import {
  viewRightMenu,
  toggleRightMenu,
  toggleRecordMenu
} from "../actions/menus";

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.toggleRightMenu = this.toggleRightMenu.bind(this);
    this.toggleRecordMenu = this.toggleRecordMenu.bind(this);
  }

  toggleRightMenu() {
    this.props.toggleRightMenu();
  }

  toggleRecordMenu() {
    this.props.toggleRecordMenu();
  }

  render() {
    this.menu = [
      {
        text: "File",
        items: [
          {
            text: "New",
            callback: this.newFile
          },
          {
            text: "Open",
            callback: this.openFile
          }
        ]
      },
      {
        text: "Edit",
        items: [
          {
            text: "Undo",
            callback: this.undo
          },
          {
            text: "Redo",
            callback: this.redo
          }
        ]
      },
      {
        text: "View",
        items: [
          {
            text: "Data Layers",
            callback: this.undo
          },
          {
            text: "List Devices",
            callback: this.redo
          },
          {
            text: this.props.rightMenu_isOpen
              ? "hide Inspector menu"
              : "Inspector Menu",
            callback: this.toggleRightMenu
          },
          {
            text: this.props.recordMenu_isOpen
              ? "hide Record menu"
              : "Record Menu",
            callback: this.toggleRecordMenu
          }
        ]
      },
      {
        text: "Device",
        items: [
          {
            text: "SerialPort",
            callback: this.undo
          },
          {
            text: "List Devices",
            callback: this.redo
          }
        ]
      }
    ];

    return (
      <div className="top-menu">
        <Toolbar menu={this.menu} url={"http://github.com/lucascassiano"} />
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.rightMenu_isOpen
    rightMenu_isOpen: state.menus.rightMenu_isOpen,
    recordMenu_isOpen: state.menus.recordMenu_isOpen
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // You can now say this.props.viewRightMenu
    viewRightMenu: isOpen => dispatch(viewRightMenu(isOpen)),
    toggleRightMenu: isOpen => dispatch(toggleRightMenu()),
    toggleRecordMenu: () => dispatch(toggleRecordMenu())
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
