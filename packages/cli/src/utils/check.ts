import fsx from 'fs'
import path from 'path'
import { Logger } from '@ionistor/logger'

export const check = async () => {
  const coreExists = fsx.existsSync(path.join(process.cwd(), 'node_modules', '@ionistor', 'core'))
  const passed = coreExists
  if (!passed) {
    Logger.log('error', '@ionistor/core package not found')
    process.exit(0)
  }
}
