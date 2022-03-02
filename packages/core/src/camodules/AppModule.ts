import { App, BrowserWindow } from "electron";

export abstract class AppModule {
  async onInit(){}
  async onIpc(app: App, window: BrowserWindow | null){}
  async onCreatingWindow(app: App, window: BrowserWindow | null){}
  async onClose(app: App, window: BrowserWindow | null){}
  async onStart(app: App, window: BrowserWindow | null){}
  async onReadyToShow(app: App, window: BrowserWindow | null){}
}

