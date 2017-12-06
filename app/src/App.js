/* eslint no-eval: 0 */
import React, { Component } from "react";
import ReactDOM from "react-dom";

import icon from "./assets/electron.png";
import {} from "./styles/App.css";

import Container3d from "react-container-3d";
import CubeView from "react-cubeview";
import "react-cubeview/css/react-cubeview.css";
import * as THREE from "three";

import Toolbar from "react-minimalist-toolbar";
import logo from "./assets/webpack.png";

import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/monokai";

// Internal UI components
import TopMenu from "./components/TopMenu";
import RightMenu from "./components/RightMenu";

import "semantic-ui-css/semantic.min.css";

import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Icon,
  Header
} from "semantic-ui-react";

const electron = window.require("electron"); // little trick to import electron in react
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateReady: false,
      name: "lucas",
      ports: null,
      visible: false,
      serial: null
    };

    console.log("dev", process);

    ipcRenderer.on("updateReady", (event, text) => {
      this.setState({ updateReady: true });
    });

    ipcRenderer.on("ports-data", (event, data) => {
      var ports = data.ports;

      const listItems = ports.map(port => port.comName);

      this.setState({ ports: listItems });
    });

    ipcRenderer.on("fileUpdate", (event, file) => {
      //alert("Update", file);
      //eval(file.toString());
      console.log(file.toString());
    });

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.updateAngles = this.updateAngles.bind(this);
  }

  onClickConnectSerial(serialname, baudrate) {
    console.log("app, serialport", { serial: serialname, baudrate: baudrate });
  }

  componentDidMount() {
    ipcRenderer.send("listSerialPorts");
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  //3D ui controllers
  getMainCanvas() {
    var mainCanvas = ReactDOM.findDOMNode(this.c3d);
    return mainCanvas;
  }
  //will update the camera angles/position from the orbitcontrols on the c3d
  updateAngles(phi, theta) {
    this.c3d.setAngles(phi, theta);
  }

  render() {
    const menu = [
      {
        text: "File",
        items: [
          {
            text: "New Project",
            callback: this.newFile
          },
          {
            text: "Save Project",
            callback: this.openFile
          },
          {
            text: "Open Project",
            callback: this.openFile
          },
          {
            text: "Export React Component",
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
            callback: this.toggleVisibility
          },
          {
            text: "List Devices",
            callback: this.redo
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
      },
      {
        text: "About",
        items: [
          {
            text: "Experimental 3",
            callback: this.undo
          },
          {
            text: "React",
            callback: this.redo
          },
          {
            text: "Electron",
            callback: this.redo
          },
          {
            text: "Three.js",
            callback: this.redo
          },
          {
            text: "Project Github",
            callback: this.redo
          }
        ]
      }
    ];

    const { visible, ports } = this.state;

    return (
      <div>
        <Toolbar menu={menu} />

        <RightMenu
          ports={ports}
          onClickConnectSerial={this.onClickConnectSerial}
        />

        <div className="canvas">
          <div className="canvas-3d">
            <Container3d
              percentageWidth={"100%"}
              fitScreen
              ref={c => (this.c3d = c)}
              key={"c3d"}
              update={this.state.codeUpdate}
              setup={this.internalSetup}
              marginBottom={30}
              code={this.state.code}
            />
          </div>

          <div className="cube-view">
            <CubeView
              aspect={1}
              hoverColor={0x0088ff}
              cubeSize={2}
              zoom={6}
              antialias={false}
              onUpdateAngles={this.updateAngles}
              relatedCanvas={this.getMainCanvas}
              antialias
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
