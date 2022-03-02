import { execa } from 'execa'

export const runScript = async (name: string, args: string[] = [], nostd: boolean = false) => {
  await execa(name, args, {
    stdio: nostd ? 'ignore' : 'inherit',
    cwd: process.cwd()
  })
}
