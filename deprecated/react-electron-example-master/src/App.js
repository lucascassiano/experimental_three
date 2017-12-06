import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let file = '~/Documents/GitHub/experimental_three/react-electron-example-master/_test.js'; //this watches a file, but I want to watch a directory instead

let azul = "azul é azul";

let r = React;

var electron = require('electron');
var currentWindow = electron.remote.getCurrentWindow();
 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    console.log(currentWindow.custom);
    
  }

  click() {
    var code = `alert(r)`;
    eval(code);
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={this.click} />
          <h2>React + Electron = <span role="img" aria-label="love">😍1</span></h2>
        </div>
        <p className="App-intro">
          Version: 0.1.9
        </p>
      </div>
    );
  }
}

export default App;
