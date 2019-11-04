/**
 *
 * @param {string} 解析传入excel地址
 * @return {string}
 */
exports.checkAddress = function (url) {
  if (!exports.isHttpUrl(url)) return 'local'
  return url.split(/https?:\/\/|:|\//)[1].split('.')[1]
}

/**
 * 解析google表格链接
 */
exports.parseGoogleDocUrl = function (url) {
  var down1 = url.split('/')
  var down2 = down1.pop()
  var url2 = down1.join('/')
  var id = down1.pop()
  var hash = down2.split('#').pop()
  var downurl = url2 + '/export?format=xlsx&id=' + id + '&' + hash
  return {
    downurl,
    id,
    hash
  }
}