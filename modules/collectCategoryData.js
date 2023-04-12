import { autoScroll } from '../autoscroll';
import { parsePage } from './parsePage';

export const collectCategoryData = async (page, currentLanguage) => {
  let productsAllData = [],
    currentPage = 1,
    tempProductsFromPage = [],
    paginationBtns = [],
    urlWithoutPage = '',
    lastPage = false

  await autoScroll(page)

  paginationBtns = await page.$$eval('.Pagination__item', (btns) => btns.map((btn) => ({
    page: btn.innerText,
    href: btn.href
  }
  )));

  const pageData = await parsePage(page, currentLanguage, productsAllData, tempProductsFromPage);
  productsAllData = [...pageData, ...productsAllData];

  if (paginationBtns.length) {
    lastPage = Number(paginationBtns.at(-1).page)
    urlWithoutPage = paginationBtns.at(1).href.slice(0, -1)
  }
  if (currentPage <= lastPage && paginationBtns.length) {
    currentPage++;
    while (currentPage <= lastPage) {
      await page.goto(urlWithoutPage + currentPage, { waitUntil: 'networkidle2' });
      currentPage++;
      await autoScroll(page)
      const pageData = await parsePage(page, currentLanguage, productsAllData, tempProductsFromPage);
      productsAllData = [...pageData, ...productsAllData];
      if (currentPage > lastPage) return productsAllData;
    }
  } else {
    return productsAllData;
  }
}