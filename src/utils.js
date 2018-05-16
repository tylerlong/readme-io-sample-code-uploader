import languageCodes from './language-codes'

export const addSampleCode = async (page, language, nth, code) => {
  // select programming language
  const languageSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code > div.options > div > div.col-sm-4 > select'
  await page.select(languageSelector, languageCodes[language])

  // write sample code
  const codeMirrorSelector = `#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code > div.body > div:nth-child(${nth}) > div.ng-pristine.ng-untouched.ng-valid > div > div.CodeMirror-scroll`
  await page.click(codeMirrorSelector)
  await page.keyboard.type(code)
}
