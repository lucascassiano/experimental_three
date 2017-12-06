import React from 'react'
import { render } from 'react-dom'
import App from './App.jsx'

//import SerialPort from 'serialport';
//console.log("PORTS",SerialPort.list())

if (process.env.NODE_ENV === 'development') {
    const electronHot = require('electron-hot-loader');
    electronHot.install();
    electronHot.watchJsx(['src/**/*.jsx']);
    electronHot.watchCss(['src/assets/**/*.css']);
}

render(
    <App />,
    document.getElementById('app')
)
