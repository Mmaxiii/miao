

var mmaxiii = function () {
  'use strict'
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
  function has(object, path) {
    return get(object, path) !== undefined

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
  function toPairs(object) {
    if (isMap(object) || isSet(object)) {
      return [...object.entries()]
    }
    let res = []
    forEach(object, (value, key) => {
      if (object.hasOwnProperty(key)) {
        res.push([key, value])
      }
    })
    return res
  }
  function values(object) {
    let result = []
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        result.push(object[key])
      }
    }
    return result
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
      if (Array.isArray(coll)) key = +key
      result.push(pred(coll[key], key, coll))
    }
    return result
  }

  function flatMap(collection, predicate) {
    return flatMapDepth(collection, predicate)
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
    let keys = Object.keys(collection)
    // object的key不会按照输入的顺序遍历出来，会按照object内部保存key的顺序。如果key是整数（非负）（如：123）或者整数类型的字符串（如：“123”），那么会按照从小到大的排序。除此之外，其它数据类型，都安装对象key的实际创建顺序排序。
    reverse(keys)
    let hasInitial = true
    if (arguments.length == 2) {
      hasInitial = false
      initial = collection[collection.length - 1]
    }

    for (let value of keys) {
      if (!hasInitial) {
        hasInitial = true
      } else (
        initial = predicate(initial, collection[value], value, collection)
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
    return maxBy(array, it => it)
  }
  function maxBy(collection, predicate) {
    predicate = iteratee(predicate)

    return reduce(collection, (result, it) => {
      result = predicate(result) > predicate(it) ? result : it
      return result
    })
  }

  function sum(array) {

    return sumBy(array, it => it)
  }
  function sumBy(collection, predicate) {
    predicate = iteratee(predicate)
    return reduce(collection, (result, it) => {
      result += predicate(it)
      return result
    }, 0)
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
    let predicate = iteratee(args.pop())
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
      let sign = true
      if (hasOwn.call(obj, key)) {
        sign = iterator(obj[key], key)
      }
      if (sign === false) break
    }
    return obj
  }
  function forOwnRight(obj, iterator) {
    let owns = []
    let sign = true
    forOwn(obj, (value, key) => owns.push(key))
    for (let i = owns.length - 1; i >= 0; i--) {
      sign = iterator(obj[owns[i]], owns[i])
      if (sign === false) break
    }
    return obj
  }
  function functions(object) {
    let owns = []
    forOwn(object, (value, key) => {
      if (isFunction(value)) owns.push(key)
    })
    return owns
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

  function findKey(object, predicate) {
    predicate = iteratee(predicate)
    for (let key in object) {
      let item = object[key]
      if (predicate(item)) {
        return key
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
  function findLastIndex(array, predicate) {
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
  function some(collection, predicate) {
    predicate = iteratee(predicate)
    for (let key in collection) {
      let temp = predicate(collection[key])
      if (temp) return true
    }
    return false
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
  function sortBy(collection, iteratees) {
    let result = []
    let keys = Object.keys(collection)
    for (let i = iteratees.length - 1; i >= 0; i--) {//iteratees中靠前的优先级高，所以从后向前
      sort(keys, iteratees[i])
    }
    forEach(keys, it => result.push(collection[it]))

    return result

    function sort(keys, predicate) {
      // 要求稳定，所以选择归并排序(原地版)
      if (keys.length < 2) return keys
      let mid = keys.length >> 1
      let left = keys.slice(0, mid)
      let right = keys.slice(mid)
      sort(left, predicate)
      sort(right, predicate)
      predicate = iteratee(predicate)
      let i = 0
      let j = 0
      let k = 0
      while (i < left.length && j < right.length) {
        let kl = left[i]
        let kr = right[j]
        if (predicate(collection[kl]) <= predicate(collection[kr])) {
          keys[k++] = kl
          i++
        } else {
          keys[k++] = kr
          j++
        }
      }
      while (i < left.length) {
        let kl = left[i]
        keys[k++] = kl
        i++
      }
      while (j < right.length) {
        let kr = right[j]
        keys[k++] = kr
        j++
      }
    }
  }
  function defer() { }
  function delay() { }
  function isArgumengts(value) {
    return Object.prototype.toString.call(value) == '[object Arguments]'
  }
  function isArray(value) {
    return Object.prototype.toString.call(value) == '[object Array]'
  }
  function isDate(value) {
    return Object.prototype.toString.call(value) == '[object Date]'
  }
  function isElement(value) {
    return Object.prototype.toString.call(value) == '[object HTMLBodyElement]'
  }
  function isObject(value) {
    return Object.prototype.toString.call(value) == '[object Object]'
  }
  function isString(value) {
    return Object.prototype.toString.call(value) == '[object String]'
  }
  function isRegExp(value) {
    return Object.prototype.toString.call(value) == '[object RegExp]'
  }
  function isFunction(value) {
    return Object.prototype.toString.call(value) == '[object Function]'
  }
  function isMap(value) {
    return Object.prototype.toString.call(value) == '[object Map]'
  }
  function isSet(value) {
    return Object.prototype.toString.call(value) == '[object Set]'
  }
  function random(...args) {
    if (args.length == 3) {
      if (args[2] === true) {
        return Math.random() * (args[1] - args[0]) + args[0]  // 浮点数只能 [ )
      } else {
        return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0]
      }
    } else if (args.length == 2) {
      if (args[1] === true) {
        let num = Math.random() * args[0]
        return num
      } else if (!Number.isInteger(args[0]) || !Number.isInteger(args[1])) {
        return Math.random() * (args[1] - args[0]) + args[0]
      } else {
        return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0]
      }
    } else if (args.length == 1) {
      if (args[0] === true) {
        return Math.random()
      } else if (args[0] === false) {
        return Math.floor(Math.random() + 0.5)
      } else {
        if (!Number.isInteger(args[0])) {
          return Math.random() * args[0]
        } else {
          return Math.floor(Math.random() * (args[0] + 1))
        }
      }
    } else {
      return Math.random()
    }
  }

  function assign(object, ...args) {
    for (let i = 0; i < args.length; i++) {
      let item = args[i]
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          object[key] = item[key]
        }
      }
    }
    return object
  }
  function assignIn(object, ...args) {
    for (let i = 0; i < args.length; i++) {
      let item = args[i]
      for (let key in item) {
        object[key] = item[key]
      }
    }
    return object
  }
  function defaults(object, ...args) {
    forEach(args, item => {
      for (let key in item) {
        if (!(key in object)) {
          object[key] = item[key]
        }
      }
    })
    return object
  }
  function forIn(object, func = it => it) {
    for (let key in object) {
      let sign = func(object[key], key)
      if (sign === false) break
    }
    return object
  }
  function forInRight(object, func) {
    let keys = []
    for (let key in object) {
      keys.push(key)
    }
    for (let i = keys.length - 1; i >= 0; i--) {
      let sign = func(object[keys[i]], keys[i])
      if (sign === false) break
    }
    return object
  }
  function invert(object) {
    return reduce(object, (result, value, key) => {
      result[value] = key
      return result
    }, {})
  }
  function invoke(object, path, ...args) {
    // get到func后用apply调用
    let keys = toPath(path)
    let func = get(object, keys)
    keys.pop()
    let newThis = get(object, keys)
    return func.apply(newThis, args)
  }
  function keys(object) {
    let keys = []
    forOwn(object, (value, key) => keys.push(key))
    return keys
  }
  function mapValues(object, predicate) {
    predicate = iteratee(predicate)
    return reduce(object, (result, value, key, object) => {
      result[key] = predicate(value, key, object)
      return result
    }, {})
  }
  function mapKeys(object, predicate) {
    predicate = iteratee(predicate)
    return reduce(object, (result, value, key, object) => {
      let newKey = predicate(value, key, object)
      result[newKey] = value
      return result
    }, {})
  }
  function assign(object, ...args) {
    for (let i = 0; i < args.length; i++) {
      let item = args[i]
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          object[key] = item[key]
        }
      }
    }
    return object
  }
  function merge(collection, ...args) {
    forEach(args, (it) => {
      for (let key in it) {
        if (isArray(collection[key]) && isArray(it[key])) {
          merge(collection[key], it[key])
        } else if (isObject(collection[key]) && isObject(it[key]) && !isArray(collection[key]) && !isArray(it[key])) {
          merge(collection[key], it[key])
        } else {
          collection[key] = it[key]
        }
      }
    })
    return collection
  }
  function pick(object, path, result = {}) {
    if (isString(path)) {
      let keys = toPath(path)
      let key = keys.shift()
      if (keys.length == 0) {
        result[key] = object[key]
      } else {
        //递归获取路径上的键值对
        result[key] = pick(object[key], keys.join('.'))
      }
    } else {
      forEach(path, it => {
        pick(object, it, result)
      })
    }
    return result
  }
  function omit(object, path, result = {}) {  // 要重写
    if (isString(path)) {
      let keys = toPath(path)
      let key = keys.shift()
      for (let k in object) {
        if (keys.length == 0) {
          if (k != key) {
            result[k] = object[k]
          }
        } else {
          if (k != key) {
            result[k] = object[k]
          } else {
            result[key] = omit(object[key], keys.join('.'))
          }
        }
      }
    } else {
      for (let k in object) {
        if (k in path) continue
        let reg = new RegExp(`^${k}\.|$`)
        let has = false
        let key
        for (key of path) {
          if (reg.test(key)) {
            has = true
            break
          }
        }
        if (has) {
          omit(object, key, result)
        } else {
          result[k] = object[k]
        }
      }
    }
    return result
  }
  function result(...args) {
    let result = get(...args)
    if (isFunction(result)) {
      result = result.apply(this)
    }
    return result === undefined ? args[args.length - 1] : result
  }
  function set(object, path, value) {
    if (isString(path)) {  // 处理路径是str的情况
      path = toPath(path)
    }
    let result = object  // 用来迭代路径
    for (let i = 0; i < path.length; i++) {
      let key = path[i]
      if (i == path.length - 1) {
        result[key] = value  // 最后一层不需要向下走，单独处理
      } else {
        if (!(key in result)) {
          if (!isNaN(Number(path[i + 1]))) { // i + 1 位是数字，表示这一层是数组
            result[key] = []
          } else {
            result[key] = {}
          }
        }
        result = result[key] // 向下走一层
      }
    }
    return object
  }
  function escape(str) {
    let map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;', "'": '&#39;' }
    let result = ''
    for (let i = 0; i < str.length; i++) {
      if (str[i] in map) {
        result += map[str[i]]
      } else {
        result += str[i]
      }
    }
    return result
  }
  function unescape(str) {
    let map = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&amp;': '&', '&#39;': "'" }
    let result = ''
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '&') {
        let k = i + 1
        while (str[k] !== ';' && k - i < 6) {
          k++
        }
        let temp = str.slice(i, k + 1)
        if (temp in map) {
          result += map[temp]
          i = k
          continue
        }
      }
      result += str[i]
    }
    return result
  }
  function padStart(str, length, char = ' ') {
    let result = ''
    let changeIdx = length - str.length
    for (let i = 0; i < changeIdx; i++) {
      let charIdx = i % char.length
      result += char[charIdx]
    }
    result += str
    return result
  }
  function padEnd(str, length, char = ' ') {
    let result = ''
    let changeIdx = length - str.length
    result += str
    for (let i = 0; i < changeIdx; i++) {
      let charIdx = i % char.length
      result += char[charIdx]
    }
    return result
  }
  function pad(str, length, char = ' ') {
    let result = str
    let startLength = result.length + (length - result.length >> 1)
    result = padStart(result, startLength, char)
    result = padEnd(result, length, char)
    return result
  }
  return {
    padStart,
    padEnd,
    pad,
    escape,
    unescape,
    set,
    result,
    pick,
    omit,
    merge,
    mapValues,
    mapKeys,
    invoke,
    invert,
    forIn,
    forInRight,
    iteratee,
    property,
    matches,
    isMatch,
    isEqual,
    matchesProperty,
    get,
    has,
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
    toPairs,
    values,
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
    maxBy,
    sum,
    sumBy,
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
    forOwnRight,
    functions,
    find,
    findKey,
    findIndex,
    findLastIndex,
    countBy,
    every,
    some,
    groupBy,
    keyBy,
    partition,
    sortBy,
    defer,
    delay,
    isArgumengts,
    isArray,
    isDate,
    isElement,
    isObject,
    isString,
    isRegExp,
    isFunction,
    isMap,
    isSet,
    random,
    assign,
    assignIn,
    defaults,
  }
}()