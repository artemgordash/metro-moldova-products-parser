import fs from 'fs';
import puppeteer from 'puppeteer';
import { collectCategoryData } from './modules/collectCategoryData.js';
import { changeToRomanian, changeToRussian } from './modules/language.js';

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

  const page = await browser.newPage();

  let currentLanguage = 'ro';
  await page.goto(`https://metro.zakaz.md/${currentLanguage}/`);

  const cookiesBtn = await page.waitForXPath('//button[.="Permiteți toate cookies" or .="Разрешить все cookies"]');
  await cookiesBtn.click();
  console.log('Cookies accepted')

  const navProductsList = await page.waitForSelector('.CategoriesMenuListContainer__list');
  const hrefs = await navProductsList.$$eval('.CategoriesMenuListItem__link', (links) => links.map((link) => link.href));
  hrefs.shift() // Deleting promotions page
  hrefs.shift() // Deleting easter promotions page
  hrefs.pop() // Deleting clothes page
  // hrefs.unshift('https://metro.zakaz.md/ro/categories/eighteen-plus/')
  // hrefs.unshift('https://metro.zakaz.md/ro/categories/for-animals/')

  fs.rmSync('data', { recursive: true, force: true });
  fs.mkdirSync('data')

  for (const category of hrefs) {
    await page.goto(category);
    const productCategoriesList = await page.waitForSelector('.CategoriesBox__list', { visible: true });
    const productsCategoryListHrefs = await productCategoriesList.$$eval('.CategoryCard', (links) => links.map((link) => link.href));
    const categoryName = category.split('/').at(-2);
    fs.mkdirSync(`data/${categoryName}`)

    for (const subcategory of productsCategoryListHrefs) {
      await page.goto(subcategory, { waitUntil: 'networkidle2' });
      const dataRO = await collectCategoryData(page, currentLanguage);
      console.log('🚀 ~ file: parseProducts.js:48 ~ dataRO:', dataRO)
      await page.goto(subcategory, { waitUntil: 'networkidle2' });
      currentLanguage = await changeToRussian(page, currentLanguage);
      const dataRU = await collectCategoryData(page, currentLanguage);
      console.log('🚀 ~ file: parseProducts.js:52 ~ dataRU:', dataRU)
      currentLanguage = await changeToRomanian(page, currentLanguage);

      const data = dataRO.map((product, index) => {
        return {
          ...product,
          title_ru: dataRU[`${index}`].title_ru,
        }
      })

      const subcategoryName = subcategory.split('/').at(-2);
      fs.writeFileSync(`data/${categoryName}/${subcategoryName}.json`, JSON.stringify(data, null, 2));
    }
  }

  // Close browser.
  // await browser.close();
})();


