
var mmaxiii = function () {

  //判断函数
  function iteratee(predicate) {  // 将 predicate 转为函数
    if (typeof predicate === 'string') {
      predicate = property(predicate)
    }
    if (Array.isArray(predicate)) {
      predicate = matchesProperty(...predicate)
    }
    if (typeof predicate === 'object') {
      predicate = matches(predicate)
    }
    return predicate  // 不是以上类型，就返回本身（函数）
  }
  function property(str) {  //传入字符串key，返回 key对应的 val (可以看做布尔值 val == true，没找到对应val就返回undefined，undefined == false)

    return bind(get, null, mmaxiii, str) //返回一个绑定了一个值的函数
  }
  function matches(obj) { // 传入对象，返回布尔值
    return function (it) {
      for (let key in obj) { //判断obj里面的所有键值对与it里面的是否全部相同
        if (it[key] !== obj[key]) return false
      }
      return true
    }
  }
  // matches 第二种写法
  // function matches(src) {
  //   return bind(isMatch, null, _, src)
  // }
  function isMatch(obj, src) {
    for (let key in src) {
      if (typeof src[key] == 'object') {
        if (!isMatch(obj[key], src[key])) return false
      } else {
        if (obj[key] !== src[key]) return false
      }

    }
    return true
  }
  function isEqual(value, other) {
    if (value === other) return true  // 基础类型
    if (value !== value && other !== other) return true  // 两边都是NaN
    if (Array.isArray(value) && (Array.isArray(other))) {
      for (let i = 0; i < value.length; i++) {
        if (!isEqual(value[i], other[i])) return false
      }
      return true
    }
    // 两边都不是数组，都不是 null，都是对象的情况
    else if (!Array.isArray(value) && !Array.isArray(other) && value && other && typeof value == 'object' && typeof other == 'object') {
      for (let key in value) {
        if (other[key] == undefined) return false
      }
      for (let key in other) {
        if (value[key] == undefined) return false
      }
      for (let key in value) {
        if (!isEqual(value[key], other[key])) return false
      }
      return true
    }
    return false
  }

  function matchesProperty(path, val) {  //path为路径 ： a.b.c
    return function (obj) {
      return isEqual(get(obj, path), val)
    }
  }
  // function matchesProperty(pair) {// 传入数组，返回布尔值
  //   let key = pair[0]  // 第一项是键
  //   let val = pair[1]  // 第二项是值
  //   return function (it) { // 判断 it里面是否有相同的键值对
  //     if (it[key] === val) return true
  //     return false
  //   }
  // }
  /**
   * @param {Object} obj  目标对象
   * @param {String/ Array} path  要取值的路径
   * @returns {Value} 要取得值
   */
  function get(obj, path, defaultValue = undefined) {
    let keys = toPath(path)
    return keys.reduce((obj, key) => {
      if (obj == undefined) {
        return defaultValue
      } else {
        return obj[key]
      }
    }, obj)
  }
  /**
  * @param {String} path  路径字符串
  * @returns {Array} 路径数组
  */
  function toPath(path) {
    if (typeof path == 'string') {
      return path.split('.')
        .flatMap(it => it.split(']'))
        .flatMap(it => it.split('['))
        .filter(it => it)
    }
    return path
  }

  /**
   * @param {Function} func  要绑定参数的函数
   * @param {this} thisArg  要给函数替换的this
   * @param {参数} fixedArgs  空位传 mmaxiii
   * @returns {Function} 绑定后的函数
   */
  function bind(func, thisArg, ...fixedArgs) {
    return function (...args) {
      let bindedArgs = fixedArgs.slice()
      let j = 0
      for (let i = 0; i < bindedArgs.length; i++) {
        if (bindedArgs[i] == mmaxiii) {
          bindedArgs[i] = args[j++]
        }
      }
      bindedArgs.push(...args.slice(j))
      return func.apply(thisArg, bindedArgs)
    }
  }
  function chunk(array, size) {
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
  }
  function compact(array) {
    let res = []
    let len = array.length
    for (let i = 0; i < len; i++) {
      if (array[i]) {
        res.push(array[i])
      }
    }
    return res
  }
  function drop(array, n = 1) {
    let res = []
    let len = array.length
    for (let i = n; i < len; i++) {
      res.push(array[i])
    }
    return res
  }
  function dropRight(array, n = 1) {
    let res = []
    let len = array.length
    for (let i = 0; i < len - n; i++) {
      res.push(array[i])
    }
    return res
  }
  function dropRightWhile(array, predicate) {
    let result = []
    predicate = iteratee(predicate)
    for (let i = array.length - 1; i >= 0; i--) {
      if (!predicate(array[i])) {
        result = array.slice(0, i + 1)
        break
      }
    }
    return result
  }
  function dropWhile(array, predicate) {
    let result = []
    predicate = iteratee(predicate)
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i])) {
        result = array.slice(i)
        break
      }
    }
    return result
  }
  function fill(array, filler, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      array[i] = filler
    }
    return array
  }
  function flatten(array) {
    return flattenDepth(array)
  }


  function flattenDeep(array) {
    return flattenDepth(array, Infinity)
  }

  function flattenDepth(array, depth = 1) {

    return array.reduce((result, item) => {
      if (Array.isArray(item) && depth) {
        result.push(...flattenDepth(item, depth - 1))
      } else {
        result.push(item)
      }
      return result
    }, [])

  }

  function fromPairs(array) {
    let res = {}
    let len = array.length
    for (let i = 0; i < len; i++) {
      res[array[i][0]] = array[i][1]
    }
    return res
  }

  function head(array) {
    return array[0]
  }

  function indexOf(array, val, from = 0) {
    let len = array.length
    for (let i = from; i < len; i++) {
      if (array[i] == val) return i
    }
    return -1
  }

  function initial(array) {
    let len = array.length - 1
    let res = []
    for (let i = 0; i < len; i++) {
      res.push(array[i])
    }
    return res
  }

  function join(ary, sep = ',') {
    let res = ''
    let len = ary.length - 1
    for (let i = 0; i < len; i++) {
      res = res + ary[i] + sep
    }
    return res + ary[len]
  }

  function last(ary) {
    return ary[ary.length - 1]
  }

  function lastIndexOf(ary, val, from = ary.length - 1) {
    for (let i = from; i >= 0; i--) {
      if (ary[i] === val) return i
    }
    return -1
  }

  function reverse(ary) {
    let n = ary.length >> 1
    for (let i = 0, j = ary.length - 1; i < n; i++, j--) {
      swap(ary, i, j)
    }
    return ary
  }

  function swap(ary, i, j) {
    let temp = ary[i]
    ary[i] = ary[j]
    ary[j] = temp
  }

  function uniq(ary) {
    let obj = {}
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (!obj[ary[i]]) {
        res.push(ary[i])
        obj[ary[i]] = 1
      }
    }
    return res
  }
  function uniqBy(array, predicate) {
    let judger = new Set()
    let result = []
    predicate = iteratee(predicate)
    forEach(array, it => {
      if (!judger.has(predicate(it))) {
        result.push(it)
        judger.add(predicate(it))
      }
    })
    return result
  }
  function without(ary, ...args) {
    let obj = formkey(args)
    let res = []
    for (let i = 0; i < ary.length; i++) {
      if (!(ary[i] in obj)) {
        res.push(ary[i])
      }
    }
    return res
  }
  function formkey(ary) {
    let res = {}
    for (let i = 0; i < ary.length; i++) {
      res[ary[i]] || (res[ary[i]] = 1)
    }
    return res
  }
  function zip(...args) {
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
  }
  /**
   * 将zip处理过的数据恢复到zip之前的状态
   * @param {Array} array 要恢复的数组
   * @returns 新数组
   */
  function unzip(array) {
    let res = []
    let len = array[0].length
    for (let i = 0; i < len; i++) { // 找出 array 中每项的第 i 个值，组成新数组，并 push 进 res
      let temp = []
      for (let j = 0; j < array.length; j++) {
        let item = array[j]
        temp.push(item[i])
      }
      res.push(temp)
    }
    return res
  }

  function filter(coll, pred) {
    pred = iteratee(pred)
    let result = []
    coll.forEach(it => {
      if (pred(it)) result.push(it)
    })
    return result
  }
  function reject(collection, predicate) {
    let result = []
    predicate = iteratee(predicate)
    forEach(collection, it => {
      if (!predicate(it)) result.push(it)
    })
    return result
  }

  function forEach(coll, pred) {

    for (let key in coll) {
      let item = pred(coll[key], key, coll)
    }
    return coll
  }

  function map(coll, pred) {
    pred = iteratee(pred)
    let result = []

    for (let key in coll) {
      // key 是字符串
      if (Array.isArray(coll)) key = +key
      result.push(pred(coll[key], key, coll))
    }
    return result
  }
  function flatMap(collection, predicate) {
    return flatMapDepth(collection, predicate, depth = 1)
  }
  function flatMapDepth(collection, predicate, depth = 1) {
    return flattenDepth(map(collection, predicate), depth)
  }
  function reduce(coll, pred, initial) {
    let hasInitial = true
    if (arguments.length == 2) {
      hasInitial = false
      initial = coll[0]
    }
    for (let key in coll) {
      if (!hasInitial) {
        hasInitial = true
      } else (
        initial = pred(initial, coll[key], key, coll)
      )
    }
    return initial
  }
  function reduceRight(collection, predicate, initial) {
    if (!Array.isArray(collection)) return reduce(collection, predicate, initial)
    let hasInitial = true
    if (arguments.length == 2) {
      hasInitial = false
      initial = collection[collection.length - 1]
    }

    for (let i = collection.length - 1; i >= 0; i--) {
      if (!hasInitial) {
        hasInitial = true
      } else (
        initial = predicate(initial, collection[i], i, collection)
      )
    }
    return initial
  }

  function sample(coll) {
    let n = Math.random() * coll.length >> 0
    return coll[n]
  }

  function shuffle(coll) {
    let result = [...coll]
    let len = result.length
    for (let i = 0; i < len; i++) {
      let swapIdx = i + Math.random() * (len - i) >> 0
      swap(result, i, swapIdx)
    }
    return result
  }
  /**
   * @param collection array/Object/string
   * @return length
   *
   */
  function size(collection) {
    let length = 0
    for (let key in collection) {
      length++
    }
    return length
  }

  function isBoolean(value) {
    return Object.prototype.toString.call(value) === '[object Boolean]'
  }

  function isNaN(value) {
    // new 出来的 NaN 必须 Number(value) 一下，让其不在是对象.变成判断 NaN == new Number(NaN) 。NaN 与自身不相等
    return isNumber(value) && value != Number(value);
  }

  function isNil(value) {
    return isNull(value) || value === undefined
  }

  function isNull(value) {
    return Object.prototype.toString.call(value) === '[object Null]'
  }

  function isNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]'
  }

  function toArray(value) {
    let res = []
    for (let key in value) {
      res.push(value[key])
    }
    return res
  }

  function ceil(number, percision = 0) {
    let base = Math.pow(10, percision)
    number = number * base
    let n = number % 1
    if (n > 0) number = (number >> 0) + 1
    number = number / base
    return number
  }

  function max(array) {
    let maxNum = -Infinity
    for (let i = 0; i < array.length; i++) {
      maxNum = array[i] > maxNum ? array[i] : maxNum
    }
    return maxNum === -Infinity ? undefined : maxNum
  }

  function sum(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
  }

  function repeat(string, n = 1) {
    let res = ''
    for (let i = 0; i < n; i++) {
      res += string
    }
    return res
  }

  function range(start = 0, end, step = 1) {
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
  }

  function cloneDeep(value) {
    let res = null
    if (Array.isArray(value)) {
      res = []
      for (let i = 0; i < value.length; i++) {
        res.push(cloneDeep(value[i]))
      }
    } else if (typeof value === 'object') {
      res = {}
      for (let key in value) {
        res[key] = cloneDeep(value[key])
      }
    } else {
      res = value
    }
    return res
  }

  function difference(...args) {
    return differenceBy(...args)
  }
  function differenceBy(...args) {
    let pred = args[args.length - 1]
    if (!Array.isArray(pred)) {
      pred = iteratee(pred)
      args.length = args.length - 1
    } else {
      pred = it => it
    }

    let judger = new Set()
    let res = []
    for (let i = 1; i < args.length; i++) {
      let temp = args[i]
      for (let j = 0; j < temp.length; j++) {
        judger.add(pred(temp[j]))
      }
    }

    let temp = args[0]
    for (let i = 0; i < temp.length; i++) {
      if (!judger.has(pred(temp[i]))) {
        res.push(temp[i])
      }
    }
    return res
  }
  function intersection(...args) {
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
  }

  function pull(array, ...args) {
    let obj = {}
    for (let i = 0; i < args.length; i++) {
      obj[args[i]] = 1
    }
    let res = filter(array, element => {
      return !(element in obj)
    })
    return res
  }
  /**
   * 检测目标值在数组中要插入的位置
   *
   * @param {Array} array 用来查询的有序数组
   * @param {Number} value 要插入的值
   * @returns {Number} 要插入的位置
   */
  function sortedIndex(array, value) {
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
  }

  function union(...args) {
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
  function unionBy(...args) {
    predicate = iteratee(args.pop())
    let judger = new Set()
    let result = []
    forEach(args, item => {
      forEach(item, it => {
        if (!judger.has(predicate(it))) {
          result.push(it)
          judger.add(predicate(it))
        }
      })
    })
    return result
  }
  function xor(...args) {
    let judger = {}
    for (let i = 0; i < args.length; i++) {
      let item = args[i]
      for (let j = 0; j < item.length; j++) {
        judger[item[j]] = (judger[item[j]] || (judger[item[j]] = 0)) + 1
      }
    }
    let res = []
    for (let key in judger) {
      if (judger[key] === 1) res.push(Number(key))
    }
    return res
  }
  function isEmpty(value) {
    if (Array.isArray(value)) {
      if (value.length !== 0) return false
    } else if (typeof value === 'object' && value) {
      for (let key in value) { // 判断obj
        return false
      }
      if (value.size() !== 0) return false // 判断map和set
    }
    return true
  }
  function min(array) {
    let min
    for (let i = 0; i < array.length; i++) {
      min = array[i] > min ? min : array[i]   // 可以处理min是undefined情况
    }
    return min
  }

  function round(number, percision = 0) {
    let base = Math.pow(10, percision)
    number = number * base
    let n = number % 1
    number = n < 0.5 ? (number >> 0) : (number >> 0) + 1

    number = number / base
    return number
  }

  function forOwn(obj, iterator) {
    let hasOwn = Object.prototype.hasOwnProperty
    for (let key in obj) {
      if (hasOwn.call(obj, key)) {
        iterator(obj[key], key)
      }
    }
    return obj
  }
  function find(collection, predicate) {
    predicate = iteratee(predicate)
    for (let key in collection) {
      let item = collection[key]
      if (predicate(item)) {
        return item
      }
    }
  }
  function findIndex(array, predicate) {
    predicate = iteratee(predicate)
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      if (predicate(item)) {
        return i
      }
    }
    return -1
  }
  function findIndex(array, predicate) {
    predicate = iteratee(predicate)
    for (let i = array.length - 1; i >= 0; i--) {
      let item = array[i]
      if (predicate(item)) {
        return i
      }
    }
    return -1
  }
  function countBy(collection, predicate) {
    let result = {}
    predicate = iteratee(predicate)
    forEach(collection, it => {
      if (predicate(it) in result) {
        result[predicate(it)]++
      } else {
        result[predicate(it)] = 1
      }
    })
    return result
  }
  function every(collection, predicate) {
    predicate = iteratee(predicate)
    for (let key in collection) {
      let item = collection[key]
      if (!predicate(item)) {
        return false
      }
    }
    return true
  }
  function groupBy(collection, predicate) {
    let result = {}
    predicate = iteratee(predicate)
    forEach(collection, it => {
      let item = predicate(it)
      if (!(item in result)) {
        result[item] = []
      }
      result[item].push(it)
    })
    return result
  }
  function keyBy(collection, predicate) {
    let result = {}
    predicate = iteratee(predicate)
    forEach(collection, it => {
      let key = predicate(it)
      result[key] = it
    })
    return result
  }
  function partition(collection, predicate) {
    let result = [[], []]
    predicate = iteratee(predicate)
    forEach(collection, it => {
      if (predicate(it)) {
        result[0].push(it)
      } else {
        result[1].push(it)
      }
    })
    return result
  }
  return {
    iteratee,
    property,
    matches,
    isMatch,
    isEqual,
    matchesProperty,
    get,
    toPath,
    bind,
    chunk,
    compact,
    drop,
    dropRight,
    dropRightWhile,
    dropWhile,
    fill,
    flatten,
    flattenDeep,
    flattenDepth,
    fromPairs,
    head,
    indexOf,
    initial,
    join,
    last,
    lastIndexOf,
    reverse,
    swap,
    uniq,
    uniqBy,
    without,
    formkey,
    zip,
    unzip,
    filter,
    reject,
    forEach,
    map,
    flatMap,
    flatMapDepth,
    reduce,
    reduceRight,
    sample,
    shuffle,
    size,
    isBoolean,
    isNaN,
    isNil,
    isNull,
    isNumber,
    toArray,
    ceil,
    max,
    sum,
    repeat,
    range,
    cloneDeep,
    difference,
    differenceBy,
    intersection,
    pull,
    sortedIndex,
    union,
    unionBy,
    xor,
    isEmpty,
    min,
    round,
    forOwn,
    find,
    findIndex,
    countBy,
    every,
    groupBy,
    keyBy,
    partition,
  }

}()