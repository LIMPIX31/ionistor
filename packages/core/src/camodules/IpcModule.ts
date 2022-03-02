import { AppModule } from './AppModule'
import { App, BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export abstract class IpcModule extends AppModule {

  constructor(private channel: string, private type: 'listener' | 'handler' | 'oncelistener' | 'oncehandler') {
    super()
  }

  abstract execute(args: any[], app: App, window: BrowserWindow, event: IpcMainInvokeEvent | IpcMainEvent)

  remove() {
    switch (this.type) {
      case 'handler':
        ipcMain.removeHandler(this.channel)
        break
      case 'listener':
        ipcMain.off(this.channel, this.exec)
        break
      case 'oncehandler':
        ipcMain.removeHandler(this.channel)
        break
      case 'oncelistener':
        ipcMain.off(this.channel, this.exec)
        break
    }
  }

  async onIpc(app: App, window: BrowserWindow | null): Promise<void> {
    this.exec = (app, window, event: IpcMainInvokeEvent | IpcMainEvent, ...args: any[]) => {
      this.execute(args, app, window, event)
    }
    switch (this.type) {
      case 'handler':
        ipcMain.handle(this.channel, this.exec)
        break
      case 'listener':
        ipcMain.on(this.channel, this.exec)
        break
      case 'oncehandler':
        ipcMain.handleOnce(this.channel, this.exec)
        break
      case 'oncelistener':
        ipcMain.once(this.channel, this.exec)
        break
    }
  }

  private exec: (app, window, event: IpcMainInvokeEvent | IpcMainEvent, ...args: any[]) => void = () => {
  }
}
