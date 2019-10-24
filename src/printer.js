// lilejia@bigo.sg

const chalk = {
  red(str) {
    return `<span style="color: red;">${str}</span>`
  },
  green(str) {
    return `<span style="color: green;">${str}</span>`
  },
  yellow(str) {
    return `<span style="color: yellow;">${str}</span>`
  },
  cyan(str) {
    return `<span style="color: cyan;">${str}</span>`
  }
}

module.exports = {
  printReport(report) {
    const { reportList, warnList, status } = report
    reportList.forEach(it => {
      console.log(chalk.green(`【多语言】：${it.msg}\n`))
    })
    if (status) {
      console.log(chalk.green('【多语言】没有发现文档的任何错误!\n'))
      return
    }
    console.log(chalk.green('【多语言】发现问题：\n'))
    const errorList = (warnList || []).filter(it => it.level === 'error').map(it => ({ Type: chalk.red('Error'), Pos: chalk.yellow(it.pos), message: chalk.red(it.msg) }))
    const warnsList = (warnList || []).filter(it => it.level === 'warn').map(it => ({ Type: chalk.green('Warn'), Pos: chalk.yellow(it.pos), message: chalk.cyan(it.msg) }))
    console.table([...errorList, ...warnsList])
  },
  printSheetList(sheets, choose) {
    sheets = sheets || []
    sheets[choose] = chalk.yellow(`${sheets[choose]} (选中)`)
    console.log(chalk.green('【多语言】当前链接检测到[') + chalk.yellow(sheets.length) + chalk.green(']张表：\n'))
    console.log(chalk.green('  [ ') + sheets.join('、') + chalk.green(' ]\n'))
  }
}
