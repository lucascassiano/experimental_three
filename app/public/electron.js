const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const { autoUpdater } = require("electron-updater");

const SerialPort = require("serialport");

let port = null;
const Readline = SerialPort.parsers.Readline;
let parser = new Readline({ delimiter: "\r\n" });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: "hidden"
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  ); // load the react app
  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.webContents.send("ready");
  mainWindow.webContents.openDevTools();
}

// when the app is loaded create a BrowserWindow and check for updates
app.on("ready", function() {
  createWindow();
  if (!isDev) autoUpdater.checkForUpdates();
});

// on MacOS leave process running also with no windows
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// if there are no windows create one
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on("update-downloaded", info => {
  mainWindow.webContents.send("updateReady");
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("listSerialPorts", (event, arg) => {
  SerialPort.list((err, ports) => {
    var output = { err: err, ports: ports };
    //var output = "err";
    mainWindow.webContents.send("ports-data", output);
    //alert("lucas");
  });
  //var output = "err";
  //mainWindow.webContents.send('ports-data', output);
});

ipcMain.on("serialport-open", (event, portName, bauds) => {
  port = new SerialPort(portName, bauds);
  port.pipe(parser);
  mainWindow.webContents.send("serialport-isOpen", port);
  // Open errors will be emitted as an error event
  port.on("error", function(err) {
    mainWindow.webContents.send("serialport-error", err.message);
  });

  port.on("open", function() {
    mainWindow.webContents.send("serialport-isOpen", true);
  });

  parser.on("data", function(data) {
    mainWindow.webContents.send("serialport-data", data);
    //console.log("data Connected", data);
  });

  ipcMain.on("serialport-write", (event, output) => {
    port.write(output);
  });

  ipcMain.on("serialport-close", event => {
    port.close();
  });

  port.on("close", function() {
    mainWindow.webContents.send("serialport-isOpen", false);
  });

});

ipcMain.on("test", (event, echo) => {
  mainWindow.webContents.send("test", echo);
});

//Watch file
/*
var fs = require('fs');
let filePath = '/Users/lucascassiano/Documents/GitHub/experimental_three/react-electron-example-master/_test.js'; //this watches a file, but I want to watch a directory instead

var file = fs.readFileSync(filePath);
console.log('Initial File content : ' + file);

fs.watchFile(filePath, function () {
  //console.log('File Changed ...');
  file = fs.readFileSync(filePath);
  //ipcMain.send('fileUpdate', file);

  mainWindow.webContents.send('fileUpdate', file);
  //console.log('File content at : ' + new Date() + ' is \n' + file);
});
*/

var watch = require("node-watch");
let filePath =
  "/Users/lucascassiano/Documents/GitHub/experimental_three/app/test.txt";

watch(filePath, { recursive: true }, function(evt, name) {
  //console.log('%s changed.', name);
  mainWindow.webContents.send("fileUpdate", name);
});

//ipcMain.send('quitAndInstall')
