import dotenv from 'dotenv'
import puppeteer from 'puppeteer'

dotenv.config()

// console.log(process.env.README_IO_EMAIL)

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://dash.readme.io/login')
  await page.screenshot({ path: 'temp.png' })

  await browser.close()
})()
