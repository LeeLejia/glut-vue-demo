// lilejia@bigo.sg

const _config = require("./config")
const lm = require("./langMap")
let config = {}
// 语言别名映射
const langMap = Object.keys(lm).reduce((res, cur) => {
  lm[cur].split(",").forEach((it) => {
    if (res[it]) {
      console.error("配置文件存在相同的语言别名！", res[it])
    }
    res[it] = cur
  })
  return res
}, {})

// 读行
function readRow(arr, idx) {
  if (!Array.isArray(arr)) {
    return []
  }
  return arr.map(
    (it) => (Array.isArray(it) && it.length > idx && it[idx]) || ""
  )
}

// 检查语言名
let langCount = 0
let langValid = 0
function checkLangRow(langRow) {
  const errorList = []
  langCount = langRow.length
  langRow.forEach((it, idx) => {
    let exist = lm[it]
    if (exist) {
      langValid++
      return
    }
    // 语言名大写
    exist = lm[it.toLowerCase()]
    if (exist) {
      errorList.push({
        pos: `1-${String.fromCharCode(65 + idx + 1)}`,
        level: "error",
        msg: `请使用小写的语言名，修改【${it}】=>【${it.toLowerCase()}】`
      })
      return
    }
    // 写为别名
    exist = langMap[it.toLowerCase()]
    if (exist) {
      errorList.push({
        pos: `1-${String.fromCharCode(65 + idx + 1)}`,
        level: "error",
        msg: `请修改语言别名，修改【${it}】=>【${exist}】`
      })
      return
    }
    // 不存在
    errorList.push({
      pos: `1-${String.fromCharCode(65 + idx + 1)}`,
      level: "error",
      msg: `不存在该语言别名【${it}】,请检查修改！`
    })
  })
  return errorList
}

// 检查一个多语言
function checkMulLang(row, rowIdx, uilangIdx) {
  const result = []
  const uilang = row[uilangIdx]
  const params = uilang.match(/\[\d+\]/g) || []
  // 非数字变量,排除{001}、{abc}、[abc]、[ab_001]正则式排除中括号影响
  if (/\[[^\]\[]*[^\d\]]+[^\]\[]*\]/i.test(uilang)) {
    result.push({
      pos: `${rowIdx + 1}-${String.fromCharCode(65 + uilangIdx + 1)}`,
      level: "error",
      msg: `变量命名不规范，不允许[abc]、[ab_001]的命名方式，将【${
        /\[[^\]\[]*[^\d\]]+[^\]\[]*\]/i.exec(uilang)[0]
        }】修改为[001]格式命名`
    })
  }
  // 检查变量序号
  const codes = params.map((it) => it.slice(1, -1)).sort()
  if (codes.length > 0 && codes[0] != 1) {
    result.push({
      pos: `${rowIdx + 1}-${String.fromCharCode(65 + uilangIdx + 1)}`,
      level: "error",
      msg: `变量命名不规范，请使用从001开始的变量，例如：[001]`
    })
  }
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] - codes[i - 1] != 1) {
      result.push({
        pos: `${rowIdx + 1}-${String.fromCharCode(65 + uilangIdx + 1)}`,
        level: "error",
        msg: `变量命名不规范，多个变量名需要使用递增的数字序号，例如：[001]、[002]、..`
      })
      break
    }
  }
  // 提示[01]、[0001]格式错误
  params.some((it) => {
    if (it.length !== 5) {
      result.push({
        pos: `${rowIdx + 1}-${String.fromCharCode(65 + uilangIdx + 1)}`,
        level: "error",
        msg: `变量命名不规范，序号不能是${it.length -
          2}个数字，应改为3位数字，例如：[001]、[002]、..`
      })
      return true
    }
    return false
  })
  // 检查多语言命名规范
  if (/[（({【]\w+[）)}】]/.test(uilang)) {
    result.push({
      pos: `${rowIdx + 1}-${String.fromCharCode(65 + uilangIdx + 1)}`,
      level: "error",
      msg: `变量命名不规范，请使用中括号和数字序号。例如：[001]`
    })
  }
  // 检查空
  row.forEach((item, index) => {
    if (!item.trim()) {
      result.push({
        pos: `${rowIdx + 1}-${String.fromCharCode(65 + index + 1)}`,
        level: "error",
        msg: `不能为空!`
      })
    }
  })
  // 检查参数不匹配
  row.forEach((item, index) => {
    params.forEach((it) => {
      if (item.indexOf(it) === -1) {
        result.push({
          pos: `${rowIdx + 1}-${String.fromCharCode(65 + index + 1)}`,
          level: "error",
          msg: `多语言缺少参数${it}`
        })
      }
    })
  })
  // 检查短文本
  const short = config.shortTextCompare
  if (!short) {
    return result
  }
  const min = Math.min(short.which[0], short.which[1])
  const max = Math.max(short.which[0], short.which[1])
  const scale = short.scale || 1.6
  if (uilang.length >= min && uilang.length <= max) {
    let notExpect = null
    let lastScale = 1
    row.forEach((item, index) => {
      if (item.length > uilang.length && item.length / uilang.length > scale) {
        const scale = item.length / uilang.length
        if (scale > lastScale) {
          notExpect = {
            pos: `${rowIdx + 1}-${String.fromCharCode(65 + index + 1)}`,
            level: "warn",
            msg: `短文本(${uilang}), 出现${scale.toFixed(2)}倍长度的文本(${item})`
          }
          lastScale = scale
        }
      }
    })
    if (notExpect) {
      result.push(notExpect)
    }
  }
  return result
}

// 处理
module.exports = function inspect(langData, conf) {
  langCount = 0
  langValid = 0
  config = Object.assign({}, _config, conf)
  const result = {
    warnList: [],
    reportList: []
  }
  // 有效行，即需要处理的行
  const validRow = []
  const keyCol = langData[0]
  const dataCols = langData.slice(1)
  let uilangIdx = 0

  // 检查文件命名
  if (keyCol[0] !== "lang") {
    result.warnList.push({
      pos: "1-A",
      level: "error",
      msg: `首行第一格必须填写为【lang】, 当前值为【${keyCol[0]}】`
    })
  }

  // 检查语言行
  const langRow = readRow(dataCols, 0)
  result.langList = langRow || []
  result.warnList.push(...checkLangRow(langRow))
  langRow.forEach((it, idx) => {
    if (it.toLowerCase() === config.uiLang.toLowerCase()) {
      uilangIdx = idx
    }
  })
  const keySet = new Set()
  keyCol.slice(1).forEach((key, index) => {
    if (keySet.has(key.toLowerCase())) {
      result.warnList.push({
        pos: `${2 + index}-A`,
        level: "error",
        msg: `存在重复键【${key}】, 请检查修改!`
      })
    } else {
      keySet.add(key.toLowerCase())
    }
    if (/^lang\d+$/.test(key)) {
      validRow.push(index + 1)
    }
  })
  result.reportList.push({
    msg: `检查到的多语言项${
      validRow.length
      }个，共[${langValid}/${langCount}]种语言`
  })
  // 依次检查单个多语言
  validRow.forEach((it) => {
    const langRow = readRow(dataCols, it)
    result.warnList.push(...checkMulLang(langRow, it, uilangIdx))
  })
  result.status = result.warnList.length === 0
  return result
}