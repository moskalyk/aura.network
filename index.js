var multifeed = require('multifeed')
var ram = require('random-access-memory')

var multi = multifeed('./db', { valueEncoding: 'json' })

// grr err
multi.writer('local', function (err, w) {
  console.log(w.key, w.writeable, w.readable)   // => Buffer <0x..> true true
  console.log(multi.feeds().length) 
})