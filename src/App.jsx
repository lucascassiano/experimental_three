'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import { render } from 'react-dom'
import { } from './styles/style.css'
import Logo from './components/Logo.jsx'
import Link from './components/Link.jsx';
import data from './assets/test.json';

import iconCheck from './assets/check.svg';
import iconReload from './assets/reload.svg';
import iconSave from './assets/save.svg';
import logo from './assets/webpack.png';

import MonacoEditor from 'react-monaco-editor';
//UI components
import { } from 'bootstrap/dist/css/bootstrap.css';
import { Alert, Button } from 'reactstrap';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
//import Toolbar from 'react-minimalist-toolbar';
//import { Button } from 'uikit-react';
import Container3d from 'react-container-3d';
import CubeView from 'react-cubeview';
import 'react-cubeview/css/react-cubeview.css';
import * as THREE from 'three';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
//import { } from 'react-tabs/style/react-tabs.css'
import AlertContainer from 'react-alert';
import { Tooltip } from 'reactstrap';
//import {} from '../../../../Library/Caches/typescript/2.6/node_modules/@types/reactstrap/lib/TetherContent';
//import DownloadButton from 'react-downloadbutton';
import OBJLoader from "three-react-obj-loader";

import Toolbar from 'react-minimalist-toolbar';
import Dropzone from 'react-dropzone';

const logos = [
    require('./assets/electron.png'),
    require('./assets/react.png'),
    require('./assets/webpack.png')
]

let mainEditor, jsonEditor;
let _this;
//let data;

///var serialPort = require("browser-serialport");

const remote = require('electron').remote;

export default class App extends Component {

    constructor(props) {
        super(props);
        console.log("data2 ", data);
        _this = this;
        window.addEventListener('offline', function (e) {
            alert("OFFLINE NOW");
        });
        this.Setup = function (scene, camera, renderer) {
            var cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshNormalMaterial());
            cube.position.y = 0;
            scene.add(cube);
        }
        var defaultCode = `
// the setup routine runs once when you press reset:
this.Setup = function (scene, camera, renderer) {
    var geometry = new THREE.SphereGeometry(10);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = "mainObject";
    scene.add(mesh);
    scene.mainMesh = mesh;
}

// the loop routine runs over and over again forever
this.Update = function (scene, camera, renderer) {
    var object = scene.getObjectByName( "mainObject" );
    //console.log("mesh intern", scene.mainMesh);
    object.rotation.y += 0.001;
    object.rotation.x += 0.001;
}`;

        var defaultJson = `{
    "sensor":[
        {
            "id":"sensor0",
             "position":{"x":0, "y":1, "z":2},
             "value": 0
        },
        {
            "id":"sensor1",
             "position":{"x":1, "y":2.5, "z":0},
             "value": 50
        },
        {
            "id":"sensor2",
             "position":{"x":1, "y":5, "z":0},
             "value": 100
        }
    ]
}`;
        var jsonData = JSON.parse(defaultJson);

        this.state = {
            code: defaultCode,
            collapsed: true,
            codeSetup: this.Setup,
            jsonCode: defaultJson,
            jsonData: jsonData,
            autoLoad: false,
            objFiles: []
        }

        this.updateAngles = this.updateAngles.bind(this);
        this.getMainCanvas = this.getMainCanvas.bind(this);
        this.onClickReload = this.onClickReload.bind(this);

        this.menu = [
            {
                text: "file",
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
                text: "edit",
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
        ];

        this.objLoader = new OBJLoader();
        this.objModels = [];
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    editorDidMount(editor) {
        mainEditor = editor;
        console.log('editorDidMount', editor);
        editor.focus();
    }

    onChange(newValue, e) {
        console.log('onChange', newValue, e);
        var code = mainEditor.getValue();
        _this.setState({ code: code });
    }

    jsonEditorDidMount(editor) {
        jsonEditor = editor;
        console.log('JsonEditorDidMount', editor);
        //editor.focus();
    }

    onChangeJson(newValue, e) {
        console.log('onChange', newValue, e);
        var currJson = jsonEditor.getValue();
        var jsonData = JSON.parse(currJson);
        _this.setState({ jsonCode: currJson, jsonData: jsonData });
    }

    onClickReload() {
        console.log("editor", mainEditor);
        var jsonCode = _this.state.jsonCode;
        const Data = JSON.parse(jsonCode);
        console.log("json file", Data);

        var code = mainEditor.getValue();

        try {
            eval(code);
        } catch (e) {
            if (e instanceof SyntaxError) {
                this.showAlert("Syntax Error", 'error', 5000);
            }
        }

        this.c3d.reloadScene();

        if (code.length > 0) {
            this.setState({ code: code, codeSetup: this.Setup, codeUpdate: this.Update });
            this.c3d.reloadScene();
        }

        console.log("c3d", this.c3d);
    }

    //will return the main container (canvas)
    getMainCanvas() {
        var mainCanvas = ReactDOM.findDOMNode(this.c3d);
        return mainCanvas;
    }

    //will update the camera angles/position from the orbitcontrols on the c3d
    updateAngles(phi, theta) {
        console.log("c3d", this.c3d);
        this.c3d.setAngles(phi, theta);
    }

    internalSetup(scene, camera, renderer) {
        var models = _this.objModels;
        for (var i in models) {
            scene.add(models[i]);
        }

        //scene.add(object);

        

        _this.state.codeSetup(scene, camera, renderer);
    }

    //called when the scene is created
    Setup(scene, camera, renderer) {
        //add cool 3d objects here ~ remember to import THREE
    }

    //called every frame
    Update(scene, camera, renderer) {
        //animate things
    }

    /*responsive monaco editor*/
    updateDimensions() {
        mainEditor.layout();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.showAlert("Version 1.0.0 Beta", 'success', 5000);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    errorAlertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }

    showAlert(text, type, time) {
        this.msg.show(text, {
            time: time,
            type: type
        })
    }

    makeFile() {
        // do some calculations
        return {
            mime: 'text/plain',
            filename: 'myexportedfile.txt',
            contents: 'all of the exports',
        }
    }

    DownloadFile() {
        var text = _this.state.code;
        var filename = "script.js";

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    onDrop(files) {
        console.log("drop", files);

        this.setState({ objFiles: files });

        for (var i in files) {
            var file = files[i];
            console.log("file path", file);

            try {
                _this.objLoader.load(file.path, function (object) {
                    object.name = file.name;
                    _this.objModels.push(object);
                });
            }

            catch (e) {
                _this.showAlert(e.toString(), "error", 5000);
            }

        }
    }

    render() {

        if (this.c3d) {
            this.c3d.reloadScene();
        }

        const { code, jsonCode } = this.state;

        console.log("rendering againg");

        const options = {
            selectOnLineNumbers: true,
            minHeight: 300
        };

        return (
            <div>
                <Toolbar menu={this.menu} logo={logo} brand="Experimental-three" url={"http://github.com/lucascassiano"}></Toolbar>

                <div className="left-side">
                    <div className="top-menu">

                        <Button onClick={this.onClickReload} >
                            <img src={iconCheck} width="15px" />
                        </Button>

                        <Button onClick={this.onClickReload} >
                            <img src={iconReload} width="70%" />
                        </Button>

                        <Button onClick={this.DownloadFile} >
                            <img src={iconSave} width="60%" />
                        </Button>
                    </div>

                    <div className="codeEditor">
                        <Tabs>
                            <TabList>
                                <Tab>Script</Tab>
                                <Tab>Data</Tab>
                                <Tab>Serial</Tab>
                                <Tab>MQTT</Tab>
                                <Tab>3D Model</Tab>
                            </TabList>

                            <TabPanel>
                                <MonacoEditor
                                    language="javascript"
                                    theme="vs-dark"
                                    width="100%"
                                    height="620"
                                    value={code}
                                    options={options}
                                    onChange={this.onChange}
                                    editorDidMount={this.editorDidMount}
                                />

                            </TabPanel>

                            <TabPanel>
                                <MonacoEditor
                                    language="json"
                                    theme="vs-dark"
                                    width="100%"
                                    height="620"
                                    value={jsonCode}
                                    options={options}
                                    onChange={this.onChangeJson}
                                    editorDidMount={this.jsonEditorDidMount}
                                />
                            </TabPanel>

                            <TabPanel>
                                Serial Port here
                        </TabPanel>

                            <TabPanel>
                                MQTT Reader here
                        </TabPanel>

                            <TabPanel>
                                <div className="dropzone">
                                    <Dropzone onDrop={this.onDrop.bind(this)}>
                                        <p>Drop .obj files (3d models), or click to select files to upload.</p>
                                    </Dropzone>
                                </div>
                                <Button>Clear .Obj</Button>

                                <h2>Dropped file:</h2>
                                <ul>
                                    {
                                        this.state.objFiles.map(f => <li>{f.name} - {f.size} bytes</li>)
                                    }
                                </ul>

                            </TabPanel>
                        </Tabs>

                    </div>
                </div>

                <div className="canvas">
                    <div className="canvas-3d" >
                        <Container3d percentageWidth={"50%"} fitScreen ref={(c) => this.c3d = c} key={"c3d"} update={this.state.codeUpdate} setup={this.internalSetup} marginBottom={30} code={this.state.code} />
                    </div>

                    <div className="cube-view">
                        <CubeView aspect={1} hoverColor={0x0088FF} cubeSize={2} zoom={6} antialias={false} onUpdateAngles={this.updateAngles} relatedCanvas={this.getMainCanvas} antialias />
                    </div>
                </div>

                <AlertContainer ref={a => this.msg = a} {...this.errorAlertOptions} />

            </div>
        )
    }
}
