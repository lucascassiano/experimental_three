import React, { Component } from 'react';
import Toolbar from 'react-minimalist-toolbar';
import { } from '../styles/Menus.css';

export default class TopMenu extends Component {
    render() {

        this.menu = [
            {
                text: "File",
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
                        callback: this.undo
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
            }
        ];

        return (
            <div className="top-menu">
                <Toolbar menu={this.menu} url={"http://github.com/lucascassiano"}></Toolbar>
            </div>
        );
    }
}