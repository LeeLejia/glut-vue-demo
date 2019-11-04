// lilejia@bigo.sg

require('console.table')
// 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
// 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
const chalk = {
  red(str) {
    return `\x1b[31m${str}\x1b[0m`
  },
  green(str) {
    return `\x1b[32m${str}\x1b[0m`
  },
  yellow(str) {
    return `\x1b[33m${str}\x1b[0m`
  },
  cyan(str) {
    return `\x1b[35m${str}\x1b[0m`
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
