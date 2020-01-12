'use strict'

var { expect } = require('chai')

describe('index.js', () => {
  it ('should equal src/index.js', () => {
    var index_orig = require('../src/index.js')
    var index = require('../index.js')
    expect(index_orig).to.eql(index)
  })
})
