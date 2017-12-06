// Basic init
const electron = require('electron');
const { app, BrowserWindow, Menu, MenuItem } = electron;

//Menu.setApplicationMenu(menu);

// Let electron reloads by itself when webpack watches changes in ./app/
//require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow;

//quit on macOS
app.on('window-all-closed', () => {
    //if (process.platform != 'darwin') {
    app.quit();
    //}
});

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        width: 1000, height: 600,titleBarStyle: 'visible',
        webPreferences: {
            experimentalFeatures: true
          }
    });
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
})
