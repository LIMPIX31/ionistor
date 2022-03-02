import path from 'path'
import * as fsx from 'fs'
import { build } from 'esbuild'
import { Logger } from '@ionistor/logger'

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

export type Config = {
  paths: {
    root: string
    src: string
    release: string
    app: string
    dist: string
    distMain: string
    distRenderer: string
    appNM: string
    srcNM: string
    srcMain: string
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
    srcRenderer: SRC_RENDERER_PATH,
  },
}

export const getConfig = async (): Promise<Config> => {
  const cfgpath = path.join(process.cwd(), 'ionistor.config.ts')
  const cfgpathbuild = path.join(__dirname, 'config.js')
  if (fsx.existsSync(cfgpath)) {
    await build({
      entryPoints: [cfgpath],
      bundle: true,
      minify: true,
      platform: 'node',
      outfile: cfgpathbuild,
      sourcemap: 'inline',
      metafile: true,
      format: 'esm',
      plugins: [
        {
          name: 'externalize-deps',
          setup(build) {
            build.onResolve({ filter: /.*/ }, args => {
              const id = args.path
              if (id[0] !== '.' && !path.isAbsolute(id)) {
                return {
                  external: true,
                }
              }
            })
          },
        },
        {
          name: 'replace-import-meta',
          setup(build) {
            build.onLoad({ filter: /\.[jt]s$/ }, async args => {
              const contents = await fsx.promises.readFile(args.path, 'utf8')
              return {
                loader: args.path.endsWith('.ts') ? 'ts' : 'js',
                contents: contents
                  .replace(
                    /\bimport\.meta\.url\b/g,
                    JSON.stringify(`file://${args.path}`)
                  )
                  .replace(
                    /\b__dirname\b/g,
                    JSON.stringify(path.dirname(args.path))
                  )
                  .replace(/\b__filename\b/g, JSON.stringify(args.path)),
              }
            })
          },
        },
      ],
    })
    try {
      return Object.assign(await import(cfgpathbuild), defaultConfig)
    } catch (e) {
      Logger.log('warn', 'Failed to load config. Using default instead')
      return defaultConfig
    }
  } else {
    return defaultConfig
  }
}
