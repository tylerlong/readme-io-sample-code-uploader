import dotenv from 'dotenv'
import puppeteer from 'puppeteer'

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

  await page.screenshot({path: 'temp.png'})
  await browser.close()
})()
