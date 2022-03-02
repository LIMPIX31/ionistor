import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { getConfig } from '../utils/config.js'

const { root, appNM, app } = (await getConfig()).paths

const { dependencies } = require(path.join(root, 'release/app/package.json'))

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(appNM)
) {
  const electronRebuildCmd =
    '../../node_modules/.bin/electron-rebuild --parallel --force --types prod,dev,optional --module-dir .'
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd
  execSync(cmd, {
    cwd: app,
    stdio: 'inherit'
  })
}
