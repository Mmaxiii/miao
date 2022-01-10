
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
      res += ary[i] + sep
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
  }

}