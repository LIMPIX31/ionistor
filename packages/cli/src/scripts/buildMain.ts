import { build } from 'esbuild'
import path from 'path'
import { getConfig } from '../utils/config'

const { srcMain, distMain } = (await getConfig()).paths

build({
  entryPoints: [
    path.join(srcMain, 'main.ts'),
    path.join(srcMain, 'preload.js')
  ],
  bundle: true,
  minify: true,
  platform: 'node',
  external: ['electron'],
  outdir: distMain
}).catch(() => process.exit(1))
