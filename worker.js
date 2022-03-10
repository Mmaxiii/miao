addEventListener('message', function (e) {
  const reg = e.data.reg
  const str = e.data.str
  const result = []
  let match
  let stert = Date.now()
  while (match = reg.exec(str)) {

    if (match[0] == '') {  // 防止死循环
      reg.lastIndex++
    } else {
      result.push(match)
    }
    if (!reg.global) {
      break
    }
  }
  let end = Date.now()
  console.log(end - stert)
  postMessage(result)
})