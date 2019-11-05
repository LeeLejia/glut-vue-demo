import sdk from 'glut-app-sdk'
import inspect from './lang-inspector'
import Papa from 'papaparse'

/**
 * 解析google表格链接
 */
function parseGoogleDocUrl(url) {
  var urlParts = url.split('/')
  var hashPart = urlParts.pop()
  var docUrl = urlParts.join('/')
  var id = urlParts.pop()
  var hash = hashPart.split('#').pop()
  var downurl = docUrl + '/export?format=csv&id=' + id + '&' + hash
  return downurl
}

export function check(url) {
  return sdk.fetch(parseGoogleDocUrl(url)).then(res => {
    if (res.status !== 0) {
      return res
    }
    const parseObj = Papa.parse(res.result)
    let arr = parseObj && parseObj.data || []
    let deleteCount = 0
    for (let i = arr[0].length - 1; i >= 0; i--) {
      let empty = true
      for (let j = 0; j < arr.length; j++) {
        if (arr[j][i].trim()) {
          empty = false
          break
        }
      }
      if (empty) {
        deleteCount++
      } else {
        break
      }
    }
    if (deleteCount) {
      arr = arr.map(it => it.slice(0, -deleteCount))
    }
    console.log(arr)
    const toArr = []
    const h = arr.length || 0
    const w = arr[0] && arr[0].length || 0

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (!toArr[j]) {
          toArr[j] = []
        }
        toArr[j][i] = arr[i][j]
      }
    }
    const report = inspect(toArr)
    return {
      status: 0,
      result: report
    };
  })
}