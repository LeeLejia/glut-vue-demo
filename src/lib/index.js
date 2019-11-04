const Util = require('./util')
const Excel = require('./excel')

function excelToJson(excelPathName, callback) {
  let sheetUrl = excelPathName;
  if (Util.checkAddress(excelPathName) === 'google') {
    sheetUrl = Util.parseGoogleDocUrl(excelPathName).downurl
  }
  new Excel(sheetUrl, {
    isColOriented: true,
  }, callback)
}
module.exports = excelToJson