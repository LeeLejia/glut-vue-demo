import sdk from 'glut-app-sdk';

export function check(url) {
  const checkUrl = `http://172.24.79.130:8089/getLangReport?url=${encodeURIComponent(url)}`
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

// http://172.24.79.130:8089/getLangReport?url=https://docs.google.com/spreadsheets/d/1J1N_BLcgyDw-HrfM_BPnW8mwj40vhzVLMw_VnliQnK0/edit#gid=0
