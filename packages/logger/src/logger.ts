import chalk from 'chalk'

const color = (s: string) => {
  switch (s[1]) {
    case 'I':
      return chalk.bgBlue.black(s)
    case 'W':
      return chalk.bgYellow.black(s)
    case 'E':
      return chalk.bgRed.black(s)
    case 'S':
      return chalk.bgGreenBright.black(s)
  }
}

export abstract class Logger {
  static log(level: 'info' | 'warn' | 'error' | 'success', message: string) {
    console.log(color(` ${level[0].toUpperCase()} `) + message)
  }
}
