import fs from 'fs';
import puppeteer from 'puppeteer';
import { changeToRussian } from './modules/language.js';
import { sleep } from './utils.js';

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    // slowMo: 100,
    headless: false,
    defaultViewport: {
      width: 1020,
      height: 680,
    },
    args: ['--start-maximized']
  });

  fs.rmSync('categories.json', { recursive: true, force: true });

  const page = await browser.newPage();

  let currentLanguage = 'ro';
  await page.goto(`https://metro.zakaz.md/${currentLanguage}/`);

  const cookiesBtn = await page.waitForXPath('//button[.="Permiteți toate cookies" or .="Разрешить все cookies"]');
  await cookiesBtn.click();
  console.log('Cookies accepted')

  const parseCategories = async () => {
    const categories = []
    const navProductsList = await page.waitForSelector('.CategoriesMenuListContainer__list');
    const hrefs = await navProductsList.$$eval('.CategoriesMenuListItem__link', (links) => links.map((link) => link.href))

    hrefs.shift() // Deleting promotions page
    hrefs.shift() // Deleting easter promotions page
    hrefs.pop() // Deleting clothes page
    // hrefs.unshift('https://metro.zakaz.md/ro/categories/eighteen-plus/')
    // hrefs.unshift('https://metro.zakaz.md/ro/categories/for-animals/')

    for (const category of hrefs) {
      await page.goto(category, { waitUntil: 'networkidle2' });
      page.evaluate(() => window.scrollTo(500, 500));
      await sleep(2000)
      const alias = category.split('/').at(-2)
      const productCategoriesList = await page.waitForSelector('.CategoriesBox__list', { visible: true });
      const categoryTitle = await page.$eval('.CategoriesBox__title_big', item => item.textContent)
      const subcategories = await productCategoriesList.$$eval('.CategoryCard', (links) => links.map((card) => ({
        title: card.querySelector('.CategoryCard__title').textContent,
        alias: card.href.split('/').at(-2),
        image: card.querySelector('.CategoryCard__image').src
      })));
      console.log('🚀 ~ file: parseCategories.js:49 ~ subcategories ~ subcategories:', subcategories)
      categories.push({
        title: categoryTitle,
        alias,
        subcategories: subcategories
      })
    }
    await page.goto(`https://metro.zakaz.md/${currentLanguage}/`);

    return categories
  }

  const titlesRO = await parseCategories()
  currentLanguage = await changeToRussian(page)
  const titlesRU = await parseCategories()

  const titles = titlesRO.map((item, categoryIndex) => ({
    title_ro: item.title,
    title_ru: titlesRU[categoryIndex].title,
    alias: item.alias,
    subcategories: titlesRO[categoryIndex].subcategories.map((item, subcategoryIndex) => ({
      title_ro: item.title,
      title_ru: titlesRU[categoryIndex].subcategories[subcategoryIndex].title,
      alias: item.alias,
      image: item.image
    }))
  }))

  console.log(JSON.stringify(titles))

  fs.writeFileSync('categories.json', JSON.stringify(titles))

  // fs.rmSync('categories', { recursive: true, force: true });
  // fs.mkdirSync('categories')

  // Close browser.
  // await browser.close();
})();


