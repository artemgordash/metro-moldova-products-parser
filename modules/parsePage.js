export const parsePage = async (page, currentLanguage, productsAllData, tempProductsFromPage) => {
  const productsBox = await page.waitForSelector('.ProductsBox__list');
  tempProductsFromPage = await productsBox.$$eval('.ProductTile', (products, currentLanguage) => products.map((product) => {
    return {
      [`title_${currentLanguage}`]: product.querySelector('.ProductTile__title').innerText,
      image: product.querySelector('.ProductTile__image').src,
    }
  }), currentLanguage);
  return productsAllData = [...productsAllData, ...tempProductsFromPage]
}