import path from 'path'

const ROOT_PATH = process.cwd()
const SRC_PATH = path.join(ROOT_PATH, 'src')
const SRC_MAIN_PATH = path.join(SRC_PATH, 'main')
const SRC_RENDERER_PATH = path.join(SRC_PATH, 'renderer')
const RELEASE_PATH = path.join(ROOT_PATH, 'release')
const APP_PATH = path.join(RELEASE_PATH, 'app')
const DIST_PATH = path.join(APP_PATH, 'dist')
const DIST_MAIN_PATH = path.join(DIST_PATH, 'main')
const DIST_RENDERER_PATH = path.join(DIST_PATH, 'renderer')
const APP_NODEMODULES_PATH = path.join(APP_PATH, 'node_modules')
const SRC_NODEMODULES_PATH = path.join(SRC_PATH, 'node_modules')


type Config = {
  paths: {
    root: string,
    src: string,
    release: string,
    app: string,
    dist: string,
    distMain: string,
    distRenderer: string,
    appNM: string,
    srcNM: string,
    srcMain: string,
    srcRenderer: string
  }
}

const defaultConfig: Config = {
  paths: {
    root: ROOT_PATH,
    src: SRC_PATH,
    release: RELEASE_PATH,
    app: APP_PATH,
    dist: DIST_PATH,
    distMain: DIST_MAIN_PATH,
    distRenderer: DIST_RENDERER_PATH,
    appNM: APP_NODEMODULES_PATH,
    srcNM: SRC_NODEMODULES_PATH,
    srcMain: SRC_MAIN_PATH,
    srcRenderer: SRC_RENDERER_PATH
  }
}

export const getConfig = async (): Promise<Config> => {
  return Object.assign({}, await import(`file://${path.join(process.cwd(), 'ionistor.config')}`), defaultConfig)
}
