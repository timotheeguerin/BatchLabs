import { BrowserWindow } from "electron";
import { BatchClientProxyFactory, StorageClientProxyFactory } from "../api";
import { Constants } from "../client-constants";
import { UniqueWindow } from "../core";

const urls = Constants.urls.genie;
const url = process.env.HOT ? urls.dev : urls.prod;

export class GenieWindow extends UniqueWindow {
    private _currentMessage = "";

    public updateMessage(message: string) {
        this._currentMessage = message;
        this._sendMessageToWindow();
    }

    public destroy() {
        super.destroy();
        this.clearMessage();
    }

    public clearMessage() {
        this.updateMessage("");
    }

    protected createWindow() {
        const window = new BrowserWindow({
            height: 340,
            width: 340,
            icon: Constants.urls.icon,
            resizable: true,
            titleBarStyle: "hidden",
            frame: true,
            title: "Batch Genie",
        });
        window.loadURL(url);
        window.webContents.once("dom-ready", () => {
            this._sendMessageToWindow();
        });

        const anyWindow = window as any;
        anyWindow.batchClientFactory = new BatchClientProxyFactory();
        anyWindow.storageClientFactory = new StorageClientProxyFactory();

        return window;
    }

    private _sendMessageToWindow() {
        if (this._window) {
            this._window.webContents.send("update-message", this._currentMessage);
        }
    }
}
