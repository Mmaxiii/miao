
var mmaxiii = {

  chunk: function (array, size) {
    let len = array.length
    let res = []
    for (let i = 0; i < len; i += size) {
      let temp = []
      let n = Math.min(i + size, len)
      for (let j = i; j < n; j++) {
        temp.push(array[j])
      }
      res.push(temp)
    }
    return res
  },

  compact: function (array) {
    let res = []
    let len = array.length
    for (let i = 0; i < len; i++) {
      if (array[i]) {
        res.push(array[i])
      }
    }
    return res
  },

  drop: function (array, n = 1) {
    let res = []
    let len = array.length
    for (let i = n; i < len; i++) {
      res.push(array[i])
    }
    return res
  },

  dropright: function (array, n = 1) {
    let res = []
    let len = array.length
    for (let i = 0; i < len - n; i++) {
      res.push(array[i])
    }
    return res
  },

  fill: function (array, filler, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      array[i] = filler
    }
    return array
  },

  flatten: function (array) {
    let res = []
    let len = array.length
    for (let i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        for (let j = 0; j < array[i].length; j++) {
          res.push(array[i][j])
        }
      } else {
        res.push(array[i])
      }
    }
    return res
  },
  flattendeep: function (array) {
    let res = []
    let len = array.length
    for (let i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {

        let temp = flattendeep(array[i])

        for (let j = 0; j < temp.length; j++) {
          res.push(temp[j])
        }
      } else {
        res.push(array[i])
      }
    }
    return res
  },

  flattendepth: function (array, depth) {
    let res = []
    let len = array.length
    for (let i = 0; i < len; i++) {

      if (Array.isArray(array[i]) && depth) {

        let temp = flattendepth(array[i], depth - 1)
        for (let j = 0; j < temp.length; j++) {
          res.push(temp[j])
        }

      } else {
        res.push(array[i])
      }
    }
    return res
  },

  frompairs: function (array) {
    let res = {}
    let len = array.length
    for (let i = 0; i < len; i++) {
      res[array[i][0]] = array[i][1]
    }
    return res
  },

  head: function (array) {
    return array[0]
  },

  indexof: function (array, val, from = 0) {
    let len = array.length
    for (let i = from; i < len; i++) {
      if (array[i] == val) return i
    }
    return -1
  },

  initial: function (array) {
    let len = array.length - 1
    let res = []
    for (let i = 0; i < len; i++) {
      res.push(array[i])
    }
    return res
  },

  join: function (ary, sep = ',') {
    let res = ''
    let len = ary.length - 1
    for (let i = 0; i < len; i++) {
      res = res + ary[i] + sep
    }
    return res + ary[len]
  },

  last: function (ary) {
    return ary[ary.length - 1]
  },

  lastindexof: function (ary, val, from = ary.length - 1) {
    for (let i = from; i >= 0; i--) {
      if (ary[i] === val) return i
    }
    return -1
  },

  reverse: function (ary) {
    let n = ary.length >> 1
    for (let i = 0, j = ary.length - 1; i < n; i++, j--) {
      this.swap(ary, i, j)
    }
    return ary
  },

  swap: function (ary, i, j) {
    let temp = ary[i]
    ary[i] = ary[j]
    ary[j] = temp
  },

  uniq: function (ary) {
    let obj = {}
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (!obj[ary[i]]) {
        res.push(ary[i])
        obj[ary[i]] = 1
      }
    }
    return res
  },

  without: function (ary, ...args) {
    let obj = this.formkey(args)
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (!(ary[i] in obj)) {
        res.push(ary[i])
      }
    }
    return res
  },
  formkey: function (ary) {
    let res = {}
    for (let i = 0; i < ary.length; i++) {
      res[ary[i]] || (res[ary[i]] = 1)
    }
    return res
  },
  zip: function (...args) {
    let res = []
    let n = args[0].length
    for (let i = 0; i < n; i++) {
      let temp = []
      for (let j = 0; j < args.length; j++) {
        temp.push(args[j][i])
      }
      res.push(temp)
    }
    return res
  },


  filter: function (coll, pred) {
    let res = []
    if (Array.isArray(pred)) {
      for (let i = 0; i < coll.length; i++) {
        if (coll[i][pred[0]] === pred[1]) res.push(coll[i])
      }
    } else if (typeof pred === 'object') {
      for (let i = 0; i < coll.length; i++) {
        let accord = false
        for (let key in pred) {
          if (coll[i][key] === pred[key]) {
            accord = true
          } else {
            accord = false
            break
          }
        }
        if (accord) res.push(coll[i])
      }
    } else if (typeof pred === 'function') {
      for (let key in coll) {
        if (pred(coll[key])) res.push(coll[key])
      }
    } else {
      for (let key in coll) {
        if (coll[key][pred]) res.push(coll[key])
      }
    }
    return res
  },

  foreach: function (coll, pred) {
    for (let key in coll) {
      pred(coll[key], key, coll)
    }
  },

  map: function (coll, pred) {
    let res = []
    if (typeof pred === 'function') {
      for (let key in coll) {
        let item = pred(coll[key], key, coll)
        res.push(item)
      }
    } else {
      for (let key in coll) {
        if (pred in coll[key]) {
          res.push(coll[key][pred])
        }
      }
    }
    return res
  },

  reduce: function (coll, pred, initial) {
    let res = []
    let start = 0
    if (arguments.length == 2) {
      initial = coll[0]
      start = 1
    }
    for (let i = start; i < coll.length; i++) {
      initial = pred(initial, coll[i])
    }
    return initial
  },

  sample: function (coll) {
    let n = Math.random() * coll.length >> 0
    return coll[n]
  },

  shuffle: function (coll) {
    let res = Array(coll.length)
    for (let i = 0; i < res.length; i++) {
      res[i] = coll[i]
    }
    let n = res.length >> 1
    for (let i = 0; i < n; i++) {
      let temp1 = Math.random() * res.length >> 0
      let temp2 = Math.random() * res.length >> 0
      this.swap(res, temp1, temp2)
    }

    return res
  },
  /**
   * @param collection array/Object/string
   * @return length
   * 
   */
  size: function (collection) {
    let length = 0
    for (let key in collection) {
      length++
    }
    return length
  },

  isboolean: function (value) {
    return value === true || value === false
  },

  isnan: function (value) {
    return !(value === value)
  },

  isnil: function (value) {
    return value === null || value === undefined
  },

  isnull: function (value) {
    return value === null
  },

  isnumber: function (value) {
    return typeof value === 'number'
  },

  toarray: function (value) {
    let res = []
    for (let key in value) {
      res.push(value[key])
    }
    return res
  },

  ceil: function (number, percision = 0) {
    let base = Math.pow(10, percision)
    number = number * base
    let n = number % base
    if (n > 0) number = (number >> 0) + 1
    number = number / base
    return number
  },

  max: function (array) {
    let maxNum = -Infinity
    for (let i = 0; i < array.length; i++) {
      maxNum = array[i] > maxNum ? array[i] : maxNum
    }
    return maxNum === -Infinity ? undefined : maxNum
  },

  sum: function (array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
  },

  repeat: function (string, n = 1) {
    let res = ''
    for (let i = 0; i < n; i++) {
      res += string
    }
    return res
  },

  range: function (start = 0, end, step = 1) {
    let res = []
    if (arguments.length === 1) {
      if (arguments[0] < 0) {
        step = -1
      }
      start = 0
      end = arguments[0]
    }
    if (step == 0) {
      let count = Math.max(start, end) - Math.min(start, end)
      for (let i = 0; i < count; i++) {
        res.push(start)
      }
      return res
    }
    if (start > end) {
      for (let i = start; i > end; i += step) {
        res.push(i)
      }
    } else {
      for (let i = start; i < end; i += step) {
        res.push(i)
      }
    }
    return res
  },

  clonedeep: function (value) {
    let res = null
    if (Array.isArray(value)) {
      res = []
      for (let i = 0; i < value.length; i++) {
        res.push(value[i])
      }
    }
  }
}