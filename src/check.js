import sdk from 'glut-app-sdk';

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

/**
 * 解析表格，待优化
 */
function parseCSV(csvData) {
  var rows = csvData.split(/\r\n|\n/)
  var lines = []
  for (var i = 0; i < rows.length; i++) {
    var data = rows[i].split(',')
    var tarr = []
    for (var j = 0; j < data.length; j++) {
      tarr.push(data[j])
    }
    lines.push(tarr)
  }
  return lines;
}

export function check(url) {
  return sdk.fetch(parseGoogleDocUrl(url)).then(res => {
    console.log(parseCSV(res))
  })
}