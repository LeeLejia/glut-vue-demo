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

// 双键json
// row0,col0不应该有重复键 todo
function arrToJson_doublekey(arr, major = 'col') {
  if (arr.length < 2 || arr[0].length < 2) {
    return {}
  }
  if (major === 'row') {
    const body = arr.slice(1)
    const obj = arr[0].slice(1).reduce((res, cur, idx) => {
      const colsObj = body.reduce((cols, it) => {
        cols[it[0].val] = it[idx + 1].val
        return cols
      }, {})
      res[cur.val] = colsObj
      return res
    }, {})
    return obj
  } else {
    const subKey = arr[0].slice(1)
    const body = arr.slice(1)
    const obj = body.reduce((res, cur) => {
      const rowObj = cur.slice(1).reduce((rows, it, idx) => {
        rows[subKey[idx].val] = it.val
        return rows
      }, {})
      res[cur[0].val] = rowObj
      return res
    }, {})
    return obj
  }
}

// 单键json
function arrToJson(arr, major = 'col') {
  if (arr.length < 2 || arr[0].length < 2) {
    return {}
  }
  if (major === 'col') {
    return arr.reduce(((res, cur) => {
      res[cur[0].val] = cur.slice(1)
      return res
    }), {})
  }
  if (major === 'row') {
    const body = arr.slice(1)
    return arr[0].reduce(((res, cur, idx) => {
      res[cur.val] = body.map(it => it[idx].val)
      return res
    }), {})
  }
}

// 双键json转php
function dbkeyJsonToPhpCode(json) {
  const keys = Object.keys(json)
  const subKeys = Object.keys(json[keys[0]])
  return keys.map((it) => {
    const item = json[it]
    const val = subKeys.map(subKey => `\t"${subKey}"=>'${item[subKey]}'`).join(',\n')
    return `"${it}" => [\n${val}\n]`
  }).join(',\n')
}

export default function htmlTransform(text) {
  const arr = htmlToArr(text);
  const dbkeyJson_row = arrToJson_doublekey(arr, 'row')
  const dbkeyJson_col = arrToJson_doublekey(arr, 'col')
  const json_row = arrToJson(arr, 'row')
  const json_col = arrToJson(arr, 'col')
  const dbkeyPhpRow = dbkeyJsonToPhpCode(dbkeyJson_row)
  const dbkeyPhpCol = dbkeyJsonToPhpCode(dbkeyJson_col)

  return {
    dbkeyJson_row,
    dbkeyJson_col,
    json_row,
    json_col,
    dbkeyPhpRow,
    dbkeyPhpCol
  }
}