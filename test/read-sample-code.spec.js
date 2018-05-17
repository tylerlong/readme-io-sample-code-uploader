/* eslint-env jest */
import fs from 'fs'
import path from 'path'

describe('read sample code', () => {
  test('hello world', () => {
    const operations = fs.readdirSync(path.join(__dirname, '..', 'sample-code'))
    for (const operation of operations) {
      console.log(operation)
      let files = fs.readdirSync(path.join(__dirname, '..', 'sample-code', operation))
      files = files.map(file => ({ filename: file, code: fs.readFileSync(path.join(__dirname, '..', 'sample-code', operation, file), 'utf-8') }))
      console.log(files)
    }
  })
})
