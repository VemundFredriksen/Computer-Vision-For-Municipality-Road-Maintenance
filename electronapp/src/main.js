import { app, BrowserWindow } from 'electron';

const url = require('url');
const path = require('path');
const { ipcMain } = require('electron');
const python = require('child_process');
const fs = require("fs")

// change base path to run script
const basePath = '/Users/ingriddomben/Documents/Projects/Computer-Vision-For-Municipality-Road-Maintenance/electronapp/src/';


let window;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  window.on('closed', () => {
    window = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});

ipcMain.on('message', (event, arg) => {
  python.spawn('python', [__dirname + `\\..\\src\\ftp_client.py`, arg]);
  event.reply('message-reply');
});
