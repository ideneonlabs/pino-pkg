'use strict'

var bench = require('fastbench')
var pino = require('../')
var bunyan = require('bunyan')
var bole = require('bole')('bench')
var winston = require('winston')
var fs = require('fs')
var dest = fs.createWriteStream('/dev/null')
var loglevel = require('./log-level-mock')(dest)
var plog = pino(dest)
delete require.cache[require.resolve('../')]
var plogExtreme = require('../')(pino.extreme('/dev/null'))
delete require.cache[require.resolve('../')]
var plogUnsafe = require('../')({safe: false}, dest)
delete require.cache[require.resolve('../')]
var plogUnsafeExtreme = require('../')({safe: false}, pino.extreme('/dev/null'))

var max = 10
var blog = bunyan.createLogger({
  name: 'myapp',
  streams: [{
    level: 'trace',
    stream: dest
  }]
})

require('bole').output({
  level: 'info',
  stream: dest
}).setFastTime(true)

var chill = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null')
    })
  ]
})

var run = bench([
  function benchBunyanObj (cb) {
    for (var i = 0; i < max; i++) {
      blog.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchWinstonObj (cb) {
    for (var i = 0; i < max; i++) {
      chill.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBoleObj (cb) {
    for (var i = 0; i < max; i++) {
      bole.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchLogLevelObject (cb) {
    for (var i = 0; i < max; i++) {
      loglevel.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoObj (cb) {
    for (var i = 0; i < max; i++) {
      plog.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeObj (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafe.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoExtremeObj (cb) {
    for (var i = 0; i < max; i++) {
      plogExtreme.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchPinoUnsafeExtremeObj (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafeExtreme.info({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
