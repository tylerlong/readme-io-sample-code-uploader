import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import * as R from 'ramda'

import { addSampleCode, filename2language } from './utils'

dotenv.config()

const DEBUG = true

const processOperation = async (page, operationId, codeFiles) => {
  const endpointUri = `https://dash.readme.io/project/${process.env.README_IO_API_SLUG}/refs/${operationId}`
  try { await page.goto(endpointUri, { waitUntil: 'networkidle0' }) } catch (e) {}

  // remove existing ACE editors
  page.once('dialog', dialog => { dialog.accept() })
  const aceEditorSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code'
  let aceEditor = await page.$(aceEditorSelector)
  const removeEditorSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > section > a.block-option.fa.fa-times.ng-scope'
  while (aceEditor !== null) {
    const box = await aceEditor.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.click(removeEditorSelector)
    aceEditor = await page.$(aceEditorSelector)
  }

  // drag & drop a code block
  const codeIconSelector = '#sticky1 > ul > li:nth-child(2) > a > i'
  const e = await page.$(codeIconSelector)
  const box = await e.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x - 300, box.y + box.height / 2) // move to (100, 200) coordinates
  await page.mouse.up()

  await addSampleCode(page, filename2language(codeFiles[0].filename), 1, codeFiles[0].code)

  const addLanguageSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code > div.ace-header > div.pull-right > a'

  let nth = 2
  for (const codeFile of R.tail(codeFiles)) {
    await page.click(addLanguageSelector)
    await addSampleCode(page, filename2language(codeFile.filename), nth, codeFile.code)
    nth += 1
  }
}

;(async () => {
  const browser = await puppeteer.launch({ headless: !DEBUG })
  const page = await browser.newPage()
  let navigationTimeout = 30000
  if (process.env.PUPPETEER_NAVIGATION_TIMEOUT) {
    navigationTimeout = parseInt(process.env.PUPPETEER_NAVIGATION_TIMEOUT)
  }
  page.setDefaultNavigationTimeout(navigationTimeout)
  page.setViewport({ width: 1280, height: 800 })

  await page.goto('https://dash.readme.io/login', { waitUntil: 'networkidle2' })

  const emailSelector = '#email'
  await page.click(emailSelector)
  await page.keyboard.type(process.env.README_IO_EMAIL)
  const passwordSelector = '#password'
  await page.click(passwordSelector)
  await page.keyboard.type(process.env.README_IO_PASSWORD)
  const loginButtonSelector = '#login > div > div > form > div.form-actions > button'
  await page.click(loginButtonSelector)
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  await processOperation(page, 'getversioninfo', [
    { filename: 'index.py', code: 'print "Hello world"' },
    { filename: 'index.rb', code: 'puts "Hello world"' },
    { filename: 'index.js', code: 'console.log("Hello world")' }
  ])

  console.log('done')
})()
