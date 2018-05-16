/* eslint-env jest */
import languageCodes from '../src/language-codes'

describe('language codes', () => {
  test('codes', () => {
    expect(languageCodes['Python']).toBe('33')
    expect(languageCodes['Ruby']).toBe('35')
  })
})
