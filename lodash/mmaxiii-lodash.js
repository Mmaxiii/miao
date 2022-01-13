
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

  dropRight: function (array, n = 1) {
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
    return flattenDepth(array)
  },

  flattenDeep: function (array) {
    return flattenDepth(array, Infinity)
  },

  flattenDepth: function (array, depth = 1) {

    return array.reduce((result, item) => {
      if (Array.isArray(item) && depth) {
        result.push(...flattenDepth(item, depth - 1))
      } else {
        result.push(item)
      }
      return result
    }, [])

  },

  fromPairs: function (array) {
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

  indexOf: function (array, val, from = 0) {
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

  lastIndexOf: function (ary, val, from = ary.length - 1) {
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

  forEach: function (coll, pred) {

    for (let key in coll) {
      let item = pred(coll[key], key, coll)

    }
    return coll
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
    for (let key in coll) {
      initial = pred(initial, coll[key], key, coll)
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

  isBoolean: function (value) {
    return value === true
  },

  isNaN: function (value) {
    return !(value === value)
  },

  isNil: function (value) {
    return value === null || value === undefined
  },

  isNull: function (value) {
    return value === null
  },

  isNumber: function (value) {
    return typeof value === 'number'
  },

  toArray: function (value) {
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
    if (step !== 0) {
      let count = (end - start) / step

      for (let i = start, j = 0; j < count; j++, i += step) {
        res.push(i)
      }

    } else {
      let count = Math.abs(end - start)
      for (let j = 0; j < count; j++) {
        res.push(start)
      }
    }

    return res
  },

  cloneDeep: function (value) {
    let res = null
    if (Array.isArray(value)) {
      res = []
      for (let i = 0; i < value.length; i++) {
        res.push(this.cloneDeep(value[i]))
      }
    } else if (typeof value === 'object') {
      res = {}
      for (let key in value) {
        res[key] = this.cloneDeep(value[key])
      }
    } else {
      res = value
    }
    return res
  },

  difference: function (...args) {
    let judger = new Set()
    let res = []
    for (let i = 1; i < args.length; i++) {
      let item = args[i]
      for (let j = 0; j < item.length; j++) {
        if (!(judger.has(item[j]))) {
          judger.add(item[j])
        }
      }
    }
    for (let i = 0; i < args[0].length; i++) {
      let item = args[0]
      if (!(judger.has(item[i]))) res.push(item[i])
    }
    return res
  },
  intersection: function (...args) {
    let obj = args[1].reduce((result, element) => {  //练习
      result[element] = 1
      return result
    }, {})
    let res = []
    for (let i = 0; i < args[0].length; i++) {
      let item = args[0][i]
      if ((item in obj)) {
        res.push(item)
      }
    }
    return res
  },

  pull: function (array, ...args) {
    let obj = {}
    for (let i = 0; i < args.length; i++) {
      obj[args[i]] = 1
    }
    let res = this.filter(array, element => {
      return !(element in obj)
    })
    return res
  },
  /**
   * 检测目标值在数组中要插入的位置
   * 
   * @param {Array} array 用来查询的有序数组
   * @param {Number} value 要插入的值
   * @returns {Number} 要插入的位置
   */
  sortedIndex: function (array, value) {
    let l = -1
    let r = array.length
    while (r - l > 1) {
      let m = (r + l) >> 1
      if (array[m] < value) {
        l = m
      } else {
        r = m
      }
    }
    return l + 1
  },

  union: function (...args) {
    let judger = new Set()
    let result = []
    for (let i = 0; i < args.length; i++) {
      let item = args[i]
      for (let j = 0; j < item.length; j++) {
        if (!(judger.has(item[j]))) {
          result.push(item[j])
          judger.add(item[j])
        }
      }
    }
    return result
  }
}