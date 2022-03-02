import fs from 'fs'
import { getConfig } from '../utils/config.js'

const { srcNM, appNM } = (await getConfig()).paths

if (!fs.existsSync(srcNM) && fs.existsSync(appNM))
  fs.symlinkSync(appNM, srcNM, 'junction')
