import sdk from 'glut-app-sdk';

function htmlToArr(text) {
  let dom = document.createElement(`div`)
  dom.innerHTML = text
  dom = dom.children && dom.children[2] && dom.children[2].children[1]
  if (!dom) {
    return []
  }
  // raw arr
  const cellArr = Array.prototype.map.call(dom.children || [], it => {
    return Array.prototype.map.call(it.children || [], cell => {
      return {
        row: cell.getAttribute('rowspan') - 0 || 1,
        col: cell.getAttribute('colspan') - 0 || 1,
        val: cell.innerText
      }
    })
  })

  // map arr
  for (let i = 0; i < cellArr.length; i++) {
    const row = cellArr[i]
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      const id = cell.id || `${i}-${j}`
      if (cell.col > 1) {
        row.splice(j + 1, 0, {
          ...cell,
          id,
          col: cell.col - 1,
        })
      }
      if (cell.row > 1) {
        cellArr[i + 1].splice(j, 0, {
          ...cell,
          id,
          row: cell.row - 1
        })
      }
      row[j] = {
        id,
        val: cell.val
      }
    }
  }
  // console.log(cellArr)
  return cellArr
}

// 全选复制文档
export function copyDoc() {
  function getEvt(keyCode, ctrl=true) {
    let evtObj = document.createEvent('UIEvents')
    evtObj.initUIEvent('keydown', true, true, window, 1)
    delete evtObj.keyCode
    // 为了模拟keycode
    if (typeof evtObj.keyCode === "undefined") {
      Object.defineProperty(evtObj, "keyCode", { value: keyCode })
    } else {
      evtObj.key = String.fromCharCode(keyCode)
    }
    // 为了模拟ctrl键
    if (typeof evtObj.ctrlKey === 'undefined') {
      Object.defineProperty(evtObj, "ctrlKey", { value: ctrl })
    } else {
      evtObj.ctrlKey = ctrl
    }
    return evtObj
  }
  const edtObj = document.querySelector('.cell-input.editable')
  if (edtObj) {
    const esc = getEvt(27, false)
    edtObj.dispatchEvent(esc)
  }
  document.body.blur()
  const ctrlA = getEvt(65)
  document.body.dispatchEvent(ctrlA)
  document.execCommand("Copy","false",null)
}


export function check(url) {
  const checkUrl = `http://172.24.79.130:8081/getLangReport?url=${encodeURIComponent(url)}`
  return sdk.fetch(checkUrl).then(res=>{
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

// http://172.24.79.130:8081/getLangReport?url=https://docs.google.com/spreadsheets/d/1J1N_BLcgyDw-HrfM_BPnW8mwj40vhzVLMw_VnliQnK0/edit#gid=0
