import React, { Component } from "react";
import ReactDOM from "react-dom";

import Container3d from "react-container-3d";
import CubeView from "react-cubeview";
import "react-cubeview/css/react-cubeview.css";
import * as _THREE from "three";
import OBJLoader from "three-react-obj-loader";

//redux
import { connect } from "react-redux";

import AlertContainer from "react-alert";

import font from "../fonts/helvetiker_regular.typeface.json";
import Text from "../utilities/Text";

import { setProjectName, setProject } from "../actions/project";

let textObject = new Text(font);

const electron = window.require("electron"); // little trick to import electron in react
const ipcRenderer = electron.ipcRenderer;

const THREE = _THREE;

var TransformControls = require("three-transformcontrols");

let _this = null;
let transformControl;
let objLoader = new OBJLoader();

class Editor3d extends Component {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      mainCode: null,
      setup: null,
      update: null,
      shaders: {
        vertex: {},
        fragment: {}
      },
      models: {
        obj: {},
        mtl: {},
        stl: {}
      },
      serial: {},
      hoveredObject: null,
      selectedObject: null,
      selectedObjectName: null,
      mouse: null
    };

    this.updateAngles = this.updateAngles.bind(this);
    this.filesUpdated = this.filesUpdated.bind(this);
    this.receiveSerialData = this.receiveSerialData.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.loadFromSerial = this.loadFromSerial.bind(this);
    this.onHoverStart = this.onHoverStart.bind(this);
    this.onHoverEnd = this.onHoverEnd.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);

    objLoader = new OBJLoader();

    this.models = {
      obj: {},
      mtl: {},
      stl: {}
    };

    ipcRenderer.on("file-update", this.filesUpdated);
    _this.setup = (scene, camera, renderer) => {};
    _this.update = (scene, camera, renderer) => {};

    ipcRenderer.on("serialport-data", (event, data) => {
      this.receiveSerialData(data);
    });

    ipcRenderer.on("clear-environment", () => {
      this.setState({
        models: {
          obj: {},
          mtl: {},
          stl: {}
        },
        shaders: {
          vertex: {},
          fragment: {}
        }
      });

      //objLoader = new OBJLoader();
      this.models = null;
      this.shaders = null;

      //this.c3d.clearScene();
      //var scene = this.c3d.getScene();
      //console.log("MY SCENE", scene);
      // if (scene)
      //scene.traverse(function(object) {
      // scene.remove(object);
      //if (object.geometry) object.geometry.dispose();
      //if (object.material) object.material.dispose();
      //object.dispose();
      // });
    });
    //window.addEventListener("mouseover", this.onMouseMove);
  }

  onMouseMove(event) {
    var mouse = new THREE.Vector2(event.x, event.y);
    console.log(mouse);

    this.setState({ mouse: mouse });
  }

  receiveSerialData(data) {
    var content = {};
    try {
      content = JSON.parse(data);
      this.setState({
        serial: content
      });
      this.serial = content;
    } catch (e) {
      console.log(e);
    }
  }

  internalSetup(scene, camera, renderer) {
    //Load Shaders
    var serial = _this.serial;
    var shaders = _this.shaders;
    var models = _this.models;

    transformControl = new TransformControls(camera, renderer.domElement);

    for (var i in models.obj) {
      scene.add(models.obj[i]);
    }

    var text = textObject.createObject("exp3 _ v0.6", 0.5);
    text.position.y = 0;
    text.position.z = 11;
    text.rotation.x = Math.PI * -0.5;
    scene.add(text);

    _this.setup(scene, camera, renderer);
  }

  internalUpdate(scene, camera, renderer) {
    //Load Shaders
    var serial = _this.serial;
    var shaders = _this.shaders;
    var models = _this.models;

    _this.update(scene, camera, renderer);
  }

  executeCode() {
    var Setup = function() {};
    var Update = function() {};

    //load shaders and models
    var shaders = this.state.shaders;
    var serial = this.state.serial;
    var models = _this.models;

    eval(this.state.mainCode);

    //if (Setup && Update) {
    _this.setup = Setup;
    _this.update = Update;
    //}

    this.setState({
      update: Update,
      setup: this.internalSetup
    });

    this.c3d.reloadScene();

    //saving data to store (Redux)
    var project = {
      mainCode: this.state.mainCode,
      shaders: this.state.shaders,
      models: this.state.models
    };

    this.props.setProject(project);
  }

  filesUpdated(event, type, fileName, filePath, content) {
    if (type == "main") {
      try {
        this.setState({
          mainCode: content
        });
        this.executeCode();
      } catch (err) {
        this.showAlert(err.toString(), "error");
      }
    }

    if (type == "vertex-shader") {
      try {
        var shader = content;

        var key = fileName.replace(".vert", "");
        var { shaders } = this.state;

        shaders.vertex[key] = content;
        this.shaders = shaders;
        this.setState({
          shaders: shaders
        });
        this.executeCode();
        //this.c3d.reloadScene();
      } catch (err) {
        this.showAlert(err.toString(), "error");
      }
    } else if (type == "fragment-shader") {
      try {
        var shader = content;
        var key = fileName.replace(".frag", "");
        var { shaders } = this.state;
        shaders.fragment[key.toString()] = content;
        this.shaders = shaders;
        this.setState({
          shaders: shaders
        });
        this.executeCode();
      } catch (err) {
        this.showAlert(err.toString(), "error");
      }
    }

    if (type == "obj") {
      var model = objLoader.parse(content);
      //changing model material
      var material = new THREE.MeshLambertMaterial({
        color: 0xa0a0a0
      });
      
      model.material = material;

      model.castShadow = true; 
      model.receiveShadow = true; 
      
      model.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
          child.castShadow = true; 
          child.receiveShadow = true; 
        }
        child.traverse(function(c) {
          c.material = material;
          c.castShadow = true; 
          c.receiveShadow = true; 
        });
      });

      var key = fileName.replace(".obj", "");

      model.name = key;

      //console.log("model", model);
      var { models } = _this.state;
      models.obj[key.toString()] = model;

      this.models = models;

      this.setState({
        models: models
      });
      this.executeCode();
    }
  }

  loadFromSerial() {
    this.executeCode();
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

  showAlert(msg, type) {
    this.msg.show(msg, {
      time: 2000,
      type: type ? type : "success"
    });
  }

  onHoverStart(object, scene, camera, renderer) {
    this.selectedObjectName = object.name;
    this.selectedObject = object;
    console.log("hovering", object);
    
    var box = new THREE.BoxHelper(object, 0x0088ff);
    box.name = "_boxHelper";
    scene.add(box);
  }

  onHoverEnd(object, scene, camera, renderer) {
    var box = scene.getObjectByName("_boxHelper");
    scene.remove(box);
  }

  onClick() {
    let { selectedObject } = this.state;
    if (selectedObject) {
      //selectedObject.position.y = selectedObject.position.y + 1;
      //let {selectedObject} = this.state;
      //console.log("selected and clicked", selectedObject.name);
      // transformControl.attach(selectedObject);
      //transformControl.name = "_tranformsControls";
      //selectedObject.add(transformControl);
    }
  }

  render() {
    return (
      <div className="canvas" onClick={this.onClick}>
        <div className="canvas-3d">
          <Container3d
            percentageWidth={"100%"}
            fitScreen
            ref={c => (this.c3d = c)}
            key={"c3d"}
            setup={this.internalSetup}
            update={this.internalUpdate}
            marginBottom={30}
            code={this.state.code}
            onHoverStart={this.onHoverStart}
            onHoverEnd={this.onHoverEnd}
            addLight={true}
            addGrid={true}
          />
        </div>
        <div className="cube-view">
          <CubeView
            aspect={1}
            hoverColor={0x0088ff}
            cubeSize={2}
            zoom={6}
            antialias={true}
            onUpdateAngles={this.updateAngles}
            relatedCanvas={this.getMainCanvas}
            antialias
          />
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />{" "}
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.rightMenu_isOpen
    project: state.project,
    name: state.project.name
  };
};

// Maps actions to props
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // You can now say this.props.viewRightMenu
    setProject: project => dispatch(setProject(project)),
    setProjectName: name => dispatch(setProjectName(name))
  };
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(Editor3d);
