import { build } from 'esbuild'
import path from 'path'
import { getConfig } from '../utils/config.js'
const { srcRenderer, distRenderer } = (await getConfig()).paths

build({
  entryPoints: [
    path.join(srcRenderer, 'main.tsx')
  ],
  bundle: true,
  minify: true,
  platform: 'browser',
  outfile: path.join(distRenderer, 'renderer.js')
}).catch(() => process.exit(1))
