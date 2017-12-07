const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const { autoUpdater } = require("electron-updater");

const SerialPort = require("serialport");

let port = null;
const Readline = SerialPort.parsers.Readline;
let parser = new Readline({ delimiter: "\r\n" });

let watch = require("node-watch");
const fs = require("fs");

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

/*Serial Port Methods*/

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

/*File Watch Methods*/

let filePath = null;

let projectEntryPoint = null;
/**Sends the entry point file (.json) */
ipcMain.on("project-select-entry", (event, filePath) => {
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      console.log(err);
      mainWindow.webContents.send("project-select-entry-return", err, null);
    }

    let entry = null;

    try {
      entry = JSON.parse(data);
      var directory = path.dirname(filePath);
      let mainFile = path.join(directory, entry.indexed_files.main);
      console.log("watching main file:" + mainFile);

      watchFile("main", mainFile, "main");
      //watching the shaders files
      let shadersDir = path.join(
        directory,
        entry.indexed_files.shadersDirectory
      );

      fs.readdir(shadersDir, (err, files) => {
        files.forEach(shaderFile => {
          console.log("shader " + shaderFile);
          let shaderFilePath = path.join(shadersDir, shaderFile);
          //vertex shader
          if (path.extname(shaderFile) == ".vert") {
            var name = path.basename(shaderFile, ".vert");
            watchFile(name, shaderFilePath, "vertex-shader");
          }
          //fragment shader
          if (path.extname(shaderFile) == ".frag") {
            var name = path.basename(shaderFile, ".frag");
            watchFile(name, shaderFilePath, "fragment-shader");
          }
        });
      });
    } catch (err) {
      console.log(err);
      mainWindow.webContents.send("project-select-entry-return", err, null);
    }

    if (entry) {
      let status = "project open with success";
      mainWindow.webContents.send("project-select-entry-return", status, entry);
    }
  });
  /*
  //mainWindow.webContents.send("test", echo);
  watch(filePath, { recursive: true }, function(evt, name) {
    
    fs.readFile("/etc/hosts", "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

    mainWindow.webContents.send("fileUpdate", name);
  });*/
});

function watchFile(name, filePath, type) {
  console.log("watching " + name + " file located at \r\n" + filePath);
  ReadFile(name, filePath, type);
  watch(filePath, { recursive: false }, function(evt, fileName) {
    ReadFile(name, filePath, type);
  });
}

function ReadFile(fileName, filePath, type) {
  console.log("reading file "+fileName+" at "+filePath);
  fs.readFile(filePath, "utf8", function(err, content) {
    if (err) {
      console.log(err);
      mainWindow.webContents.send(
        "file-update",
        type,
        fileName,
        filePath,
        null
      );
    } else mainWindow.webContents.send("file-update", type, fileName, filePath, content);
  });
}
