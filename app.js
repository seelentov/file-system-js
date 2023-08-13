/* eslint-disable no-unused-vars */
import { findPathsByName, getPath, search, findFilesByName, findEmptyDirPaths, getType, getAllSizes, du, get, getSubdirectoriesCount, getHiddenCount, getAllNames, getSize, getNodesCount, add, hide, show, rename, mkdir, mkfile, getName, getMeta, getChildren, isFile, isDir, compressImg, showdfs, changeOwner, copy, changeCase } from './fileSystem.js'

const tree =
mkdir('nodEjs-paCkage',
  [mkfile('Makefile'),
    mkfile('README.md'),
    mkdir('dist'),
    mkdir('__tests__',
      [mkfile('half.test.js')]),
    mkfile('babel.config.js'),
    mkdir('node_modules',
      [mkdir('@babel',
        [mkdir('cli',
          [mkfile('LICENSE')])])])])

const tree2 =
mkdir('my documents', [
  mkfile('avatar.jpg', { size: 100 }),
  mkfile('passport.jpg', { size: 200 }),
  mkfile('family.jpg', { size: 150 }),
  mkfile('addresses', { size: 125 }),
  mkdir('presentations')
], { hidden: false })

const tree3 =
mkdir('/', [
  mkdir('etc', [
    mkfile('bashrc'),
    mkfile('consul.cfg')
  ]),
  mkfile('hexletrc'),
  mkdir('bin', [
    mkfile('ls'),
    mkfile('cat')
  ])
])

const tree4 = mkdir('/', [
  mkdir('etc', [
    mkdir('.apache'),
    mkdir('nginx', [
      mkfile('.nginx.conf', { size: 800 })
    ]),
    mkdir('.consul', [
      mkfile('.config.json', { size: 1200 }),
      mkfile('data', { size: 8200 }),
      mkfile('raft', { size: 80 })
    ])
  ]),
  mkfile('.hosts', { size: 3500 }),
  mkfile('resolve', { size: 1000 })
])

const tree5 = mkdir('/', [
  mkdir('etc', [
    mkdir('apache'),
    mkdir('data2'),
    mkdir('nginx', [
      mkfile('nginx.conf')
    ]),
    mkdir('consul', [
      mkfile('config.json'),
      mkdir('data')
    ])
  ]),
  mkdir('logs'),
  mkfile('hosts')
])

console.log(showdfs(tree5))
