import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import delay from 'timeout-as-promise'

dotenv.config()

const DEBUG = true

;(async () => {
  const browser = await puppeteer.launch({ headless: !DEBUG })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(20000)
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

  // const enterpriseSelector = '#all-projects > div.container-main.container-main-projects > div:nth-child(6) > div:nth-child(1) > a'
  // await page.click(enterpriseSelector)
  // await page.waitForNavigation({ waitUntil: 'networkidle2' })

  const endpointUri = `https://dash.readme.io/project/${process.env.README_IO_API_SLUG}/refs/getversioninfo`
  try {
    await page.goto(endpointUri, { waitUntil: 'networkidle0' })
  } catch (e) {
    console.log(e.message)
    // ignore Navigation Timeout Exceeded
  }

  // drag & drop a code block
  const codeIconSelector = '#sticky1 > ul > li:nth-child(2) > a > i'
  const e = await page.$(codeIconSelector)
  const box = await e.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x - 300, box.y + box.height / 2) // move to (100, 200) coordinates
  await page.mouse.up()

  // select programming language
  await delay(100)
  const languageSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code > div.options > div > div.col-sm-4 > select'
  await page.select(languageSelector, '33') // Python's <select> <option> value is 12

  // write sample code
  const codeMirrorSelector = '#page-editor > div.fill > div.ng-scope > div > div.block.ng-scope > div > div > div.block.section.type-code > div > div > div > div.ace-editor.block-edit-code > div.body > div > div.ng-pristine.ng-untouched.ng-valid > div > div.CodeMirror-scroll'
  await page.click(codeMirrorSelector)
  await page.keyboard.type('print "Hello world"')

  await delay(3000)
  await page.screenshot({path: 'temp.png'})
  await browser.close()
})()
