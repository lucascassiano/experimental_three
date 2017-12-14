import React, { Component } from "react";

//import icon_menu from "../assets/menu.svg";
import arrow_left from "../assets/left_arrow_menu.svg";
import arrow_right from "../assets/right_arrow_menu.svg";

import { Button, Classes, Dialog, Tooltip } from "@blueprintjs/core";
import "@blueprintjs/core/dist/blueprint.css";
import "normalize.css/normalize.css";

import {} from "../styles/Menus.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { connect } from "react-redux";
import { toggleRecordMenu } from "../actions/menus";
import Draggable from "react-draggable";

import icon_record_off from "../assets/record_off.svg";
import icon_record_on from "../assets/record_on.svg";
import icon_record_outline from "../assets/record_outline.svg";

class RecordMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      recording: false,
      showModal: false
    };
    this.toggleRecord = this.toggleRecord.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleMenu() {
    this.setState({ open: !this.state.open });

    this.props.toggleRecordMenu(this.state.open);
  }

  toggleRecord() {
    if (this.state.recording) {
      //save recording
      this.toggleModal();
    }
    this.setState({ recording: !this.state.recording });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const open = this.props.recordMenu_isOpen;
    let icon_menu = arrow_left;
    let icon_menu_under = arrow_left;

    let style = {
      opacity: 0,
      visible: false
    };

    let styleButton = {
      right: "0px"
    };

    let classIcon = "icon";

    if (open) {
      style.opacity = 1;
      style.visible = true;
      styleButton.right = 400;
      styleButton.background = "#212121";
      //icon_menu = arrow_right;
      classIcon = "icon icon-open";
    }

    let icon_record = icon_record_off;
    let icon_record_class = "item record";

    if (this.state.recording) {
      icon_record = icon_record_on;
      icon_record_class = " item record blink";
    }

    return (
      <div>
        <div className="record-menu" style={style}>
          <div className="close-record-menu" onClick={this.toggleMenu}>
            x
          </div>
          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>Record</Tab>
              <Tab>Timeline</Tab>
            </TabList>
            <TabPanel>
              <div className="record-menu-grid">
                <div className={icon_record_class} onClick={this.toggleRecord}>
                  {" "}
                  <img
                    src={icon_record}
                    background={icon_record_outline}
                  />{" "}
                </div>
                <div className="item">
                  {" "}
                  <div className="label">Number of points</div>{" "}
                  <div className="value"> 1000</div>
                </div>
                <div className="item">
                  {" "}
                  <div className="label">File Size</div>
                  <div className="value">0 Kb</div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="record-menu-grid">
                <div className="item"> timeline</div>
                <div className="item"> c</div>
              </div>
            </TabPanel>
          </Tabs>
        </div>

        <div>
          <Dialog
            iconName="inbox"
            title="Save Data Stream"
            isOpen={this.state.showModal}
            onClose={this.toggleModal}
            className="docs-dialog-example"
          >
            <div className="dialog-content">
              Data Stream was saved to file: /users/something/test.json
            </div>
            <div className="dialog-footer">
              <div>
                <Tooltip
                  content="This button is hooked up to close the dialog."
                  inline={true}
                >
                  <Button onClick={this.toggleModal}>Cancel</Button>
                </Tooltip>

                <Button className="pt-intent-primary" onClick={this.toggleModal}>Ok</Button>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.rightMenu_isOpen
    recordMenu_isOpen: state.menus.recordMenu_isOpen
  };
};

// Maps actions to props
const mapDispatchToProps = dispatch => {
  return {
    toggleRecordMenu: isOpen => dispatch(toggleRecordMenu())
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(RecordMenu);
