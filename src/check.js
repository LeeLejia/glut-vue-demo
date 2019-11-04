import sdk from 'glut-app-sdk';

export function check(url) {
  const checkUrl = `http://--/getLangReport?url=${encodeURIComponent(url)}`
  return sdk.fetch(checkUrl).then(res => {
    if (res.status === 0) {
      return {
        status: true,
        result: JSON.parse(res.result)
      }
    }
    return {
      status: false,
      msg: '处理失败'
    }
  })
}

fetch('https://docs.google.com/spreadsheets/d/1J1N_BLcgyDw-HrfM_BPnW8mwj40vhzVLMw_VnliQnK0/export?format=csv&id=1J1N_BLcgyDw-HrfM_BPnW8mwj40vhzVLMw_VnliQnK0&gid=0').then(res => res.text()).then(res => processData(res))

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {

      var tarr = [];
      for (var j = 0; j < headers.length; j++) {
        tarr.push(headers[j] + ":" + data[j]);
      }
      lines.push(tarr);
    }
  }
  console.log(lines)
}