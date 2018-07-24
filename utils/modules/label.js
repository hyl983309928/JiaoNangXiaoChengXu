const api = require('../api.js')

var labelList = null
var labelHashTable = {}
var rootLabelTree = []

function getLabelList (reload = false) {
  if (labelList && !reload) {
    return new Promise(function (resolve, reject) {
      resolve(labelList)
    })
  } else {
    return api.label.getList().then((data) => {
      labelList = data.list
      labelHashTable = getHashTable(labelList)
      rootLabelTree = getLabelTree(labelList)
      return labelList
    })
  }
}
function getHashTable (list) {
  if (labelHashTable[5]) {
    return labelHashTable
  } else {
    let hashTable = {}
    list.forEach(function (item) {
      if (item.labelImg && item.labelImg.indexOf('./uploads') != -1) {
        item.labelImg = 'http://wx.xinjijiaoyu.com' + item.labelImg.substring(1)
      }
      hashTable[item.id] = item
    })
    return hashTable
  }
}
function getChildrenLabels(list, id) {
  var labelTree = getLabelTree(list)
  for (var i = 0; i < labelTree.length; i++) {
    if (labelTree[i].id == id) {
      return labelTree[i].childs
    }
  }
  return []
}
function getLabelTree (labelList) {
  if (rootLabelTree.length != 0) {
    return rootLabelTree
  }
  var result = []
  var hashTable = {}
  for (var i = 0; i < labelList.length; i++) {
    var label = labelList[i]
    var id = label.id
    var parentId = label.parent_id
    parentId = parseInt(parentId)

    hashTable[id] = label
    label.childs = []

    if (parentId === 0) {
      result.push(label)
    } else {
      var parent = hashTable[parentId]
      parent.childs.push(label)
    }
  }

  return result
}

module.exports = {
  getLabelList,
  getHashTable,
  getLabelTree,
  getChildrenLabels
}