#!/usr/bin/env node
import { program } from 'commander'
import { runScript } from '../utils/runScript.js'
import { CliStage } from 'cli-stage'
import { getConfig } from '../utils/config'
import path from 'path'
import { Logger } from '@ionistor/logger'
import { check } from '../utils/check'

const tsconf = 'node_modules/@ionistor/core/dist/tsconfig.electron.json'

const { srcMain } = (await getConfig()).paths

Logger.log('info', 'Checking')

await check()

Logger.log('info', 'Starting IONISTOR')

program.name('ionistor-scripts')

program
  .command('start')
  .action(async () => {
    Logger.log('info', 'Starting dev server')
    try {
      await runScript('concurrently', ['-k', '-n', '"RENDERER,MAIN"', '-c', '"green,blue"', '"vite"', `"cross-env TS_NODE_PROJECT=${tsconf} cross-env NODE_ENV=development electron -r esbuild-runner/register ${path.join(srcMain, 'main.ts')}"`])
    } catch (e) {
    }
  })
program
  .command('build')
  .action(async () => {
    Logger.log('info', 'Bundling...')
    const clis = new CliStage('Building [Renderer]', 'Building [Main]')
    clis.start()

    try {
      await runScript('tsc', [], true)
      await runScript('vite build', [], true)
      clis.success()
    } catch (e) {
      clis.error(true)
      console.error(e)
      process.exit(1)
    }

    try {
      await runScript('cross-env NODE_ENV=production node node_modules/ionistor/lib/scripts/buildMain', [], true)
      clis.success()
    } catch (e) {
      clis.error(true)
      console.error(e)
      process.exit(1)
    }
  })
program
  .command('rebuild')
  .action(async () => {
    Logger.log('info', 'Rebuilding...')
    await runScript('electron-rebuild', ['--parallel', '--types', 'prod,dev,optional', '--module-dir release/app'])
  })

program.parse()
