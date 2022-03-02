import rimraf from 'rimraf'
import process from 'process'
import { getConfig } from '../utils/config.js'

const { dist } = (await getConfig()).paths

const args = process.argv.slice(2)
const commandMap: { [k: string]: string } = { dist }

args.forEach((x) => {
  if (commandMap[x]) rimraf.sync(commandMap[x])
})
