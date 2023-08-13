/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable padded-blocks */
/* eslint-disable no-useless-return */

// Создание файла
export const mkfile = (name, meta = 0) => {
  const file = {}
  file.name = name
  file.type = 'file'
  file.meta = meta !== 0 ? meta : {}
  file.meta.hidden = name.startsWith('.')

  const lastPoint = name.match(/[^.]+$/)

  const checkPoints = () => {

    if (name.match(/\./g)) return name.match(/\./g).length >= 2
  }

  (lastPoint !== null && !/^[.]/.test(name)) || checkPoints()
    ? file.meta.extension = lastPoint[0]
    : file.meta.extension = 'txt'

  if (!file.meta.size) file.meta.size = 1
  return file
}

// Создание директории
export const mkdir = (name, children = [], meta = 0) => {
  const dir = {}
  dir.name = name
  dir.type = 'dir'
  dir.meta = meta !== 0 ? meta : {}
  dir.children = children
  dir.meta.hidden = name.startsWith('.')
  let size = 0
  if (children) {

    children.forEach(e => {
      if (e) size += e.meta.size

    })
  }
  dir.meta.size = size
  return dir
}

// Проверка типа объекта
export const isFile = (prop) => prop.type === 'file'
export const isDir = (prop) => prop.type === 'dir'

// Получение данных из объекта
export const getName = (prop) => prop.name || null
export const getMeta = (prop) => prop.meta || null
export const getChildren = (prop) => prop.children || null
export const getType = (prop) => prop.type || null

// Сжатие размера файлов директории в 2 раза
export const compress = (tree) => {
  const newTree = JSON.parse(JSON.stringify(tree))
  const childrens = getChildren(newTree).map(e => {
    if (isFile(e)) {
      const result = {
        name: e.name,
        type: e.type
      }
      if (e.meta) {
        result.meta = e.meta
        if (e.meta.size) e.meta.size /= 2
      }
      return result
    } else return e
  })
  return mkdir(getName(newTree), childrens)
}

// Выводит в консоль все имена файлов и биректорий дерева
export const showdfs = (tree) => {

  console.log(getName(tree))
  if (isFile(tree)) {
    return
  }

  const children = getChildren(tree)
  if (children) { children.forEach(showdfs) }
}

// Меняет владельца файла
export const changeOwner = (tree, owner) => {
  const name = getName(tree)
  const newMeta = JSON.parse(JSON.stringify(getMeta(tree)))
  newMeta.owner = owner

  if (isFile(tree)) {
    // Возвращаем обновлённый файл
    return mkfile(name, newMeta)
  }

  const children = getChildren(tree)
  // Ключевая строчка
  // Вызываем рекурсивное обновление каждого ребёнка
  const newChildren = children.map((child) => changeOwner(child, owner))
  const newTree = mkdir(name, newChildren, newMeta)

  // Возвращаем обновлённую директорию
  return newTree
}

// Копирует файл/директорию + защита от одинаковых названий
export const copy = (prop, name = getName(prop) + ' copy') => {

  const newPropMeta = JSON.parse(JSON.stringify(getMeta(prop)))

  if (isFile(prop)) {

    return mkfile(name, newPropMeta)
  }

  const children = JSON.parse(JSON.stringify(getChildren(prop)))

  const newProp = mkdir(name, children, newPropMeta)

  return newProp
}

// Получить названия всех файлов/директорий дерева массивом строк
export const getAllNames = (tree) => {

  const result = []

  function pushProps (tree) {
    result.push(tree.name)
    if (getChildren(tree)) getChildren(tree).forEach(child => pushProps(child))
  }
  pushProps(tree)

  return result
}

// Перевести названия всех файлов/директорий в верхний или нижний регистр (change = 'lower / 'upper')
export const changeCase = (prop, change = 'lower') => {

  const newPropName = change === 'upper' ? getName(prop).toUpperCase() : getName(prop).toLowerCase()

  const newPropMeta = JSON.parse(JSON.stringify(getMeta(prop)))

  if (isFile(prop)) {
    // Возвращаем обновлённый файл
    return mkfile(newPropName, newPropMeta)
  }

  const newPropChildren = getChildren(prop).map(child => changeCase(child, change))
  // Ключевая строчка
  // Вызываем рекурсивное обновление каждого ребёнка
  const newProp = mkdir(newPropName, newPropChildren, newPropMeta)

  // Возвращаем обновлённую директорию
  return newProp
}

// Переименовать файл
export const rename = (prop, newName) => {
  prop.name = newName
}

// Спрятать файл (дать свойство hidden: true)
export const hide = (prop) => {
  prop.meta.hidden = true
}

// Показать файл (дать свойство hidden: false)
export const show = (prop) => {
  prop.meta.hidden = false
}

// Добавить файл в указанную ддирукторию дерева (защита от добавления существующих файлов)
export const add = (prop, dir, tree) => {

  if (!getChildren(tree)) {

    return
  }

  if (getName(tree) === dir) {

    if (getAllNames(tree).some((e) => e === prop.name)) {
      console.log('Файл с таким именем уже существует в данной директории. Действие не выполнено!')
      return
    }
    tree.children.push(prop)
    console.log(`"${prop.name}" (${prop.type}) ADD TO: "${getName(tree)}"`)
  }

  if (isFile(tree)) {

    return
  }
  getChildren(tree).forEach(e => add(prop, dir, e) || '')

}

// Получить количество файлов дерева
export const getNodesCount = (tree) => {
  let count = 0
  function countUpper (tree) {
    count++
    if (getChildren(tree)) getChildren(tree).forEach(e => countUpper(e))
  }
  countUpper(tree)

  return count
}

// Получить количество скрытых файлов
export const getHiddenCount = (tree) => {
  let count = 0
  function countUpper (tree) {
    if (getName(tree).startsWith('.')) count++
    if (getChildren(tree)) getChildren(tree).forEach(e => countUpper(e))
  }
  countUpper(tree)

  return count
}

// Получить размер файла
export const getSize = (dir) => dir.meta.size

export const getSubdirectoriesCount = (tree) => {
  return getChildren(tree).map(e => {
    if (getChildren(e)) return [e.name, getChildren(e).length]
    return [e.name]
  })
}

// Получить функционирующий файл по названию из дерева
export const get = (propName, tree) => {
  if (!getAllNames(tree).some((e) => e === propName)) {
    return console.log(`Файл "${propName}" в "${tree.name}" не найден!`)
  }
  let newProp = {}
  const recursion = (tree, propName) => {
    if (getName(tree) === propName) {
      newProp = { ...tree }
    }
    if (isFile(tree)) return

    getChildren(tree).forEach(e => recursion(e, propName))

  }
  recursion(tree, propName)

  return newProp

}

// Получить массив [['имя', размер],...]
export const du = (dir) => {
  return getChildren(dir).map(e => {
    return [getName(e), getSize(e)]
  })
}

export const getAllSizes = (tree) => {

  const result = []

  function pushProps (tree) {
    result.push([getName(tree), getSize(tree), getType(tree)])
    if (getChildren(tree)) getChildren(tree).forEach(child => pushProps(child))
  }
  pushProps(tree)

  return result
}

// Получить список пустых директорий дерева
export const findEmptyDirPaths = (tree) => {

  const iter = (node, depth) => {
    const name = getName(node)
    const children = getChildren(node)

    if (children.length === 0) {
      return name
    }

    if (depth === 2) {

      return []
    }

    // Оставляем только директории
    return children.filter(isDir)
      // Не забываем увеличивать глубину
      .flatMap((child) => iter(child, depth + 1))

  }

  // Начинаем с глубины 0
  return iter(tree, 0)
}

// Получить массив фукциональных файлов по части названия (строки)
export const search = (tree, string) => {
  const result = []
  getAllNames(tree)
    .filter(e => {
      return e.includes(string) && isFile(get(e, tree))
    })
    .forEach(e => result.push(get(e, tree)))
  return result
}

// Получить путь файла по названию
export const getPath = (tree, file) => {
  const result = []
  const recursion = (tree, file) => {
    if (getAllNames(tree).some(e => e === file)) result.push(tree.name)
    if (isDir(tree)) getChildren(tree).forEach(e => recursion(e, file))

  }
  recursion(tree, file)
  return result.join('/').replace('//', '/')
}

// Получить пути файлов по части названия (строки)
export const findPathsByName = (tree, stroke) => {
  const result = []
  const files = getAllNames(tree).filter(e => {
    return e.includes(stroke) && isFile(get(e, tree))
  })
  files.forEach(e => result.push(getPath(tree, e)))
  return result
}
