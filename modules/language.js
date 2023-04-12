export const changeToRomanian = async (page) => {
  const roLanguageBtn = await page.waitForXPath('//a[.="Ro" and contains(@class, "switch-locale__link")]');
  const href = await roLanguageBtn.evaluate((link) => link.href);
  await page.goto(href, { waitUntil: 'networkidle2' })
  return 'ro'
};
export const changeToRussian = async (page) => {
  const ruLanguageBtn = await page.waitForXPath('//a[.="Ru" and contains(@class, "switch-locale__link")]');
  const href = await ruLanguageBtn.evaluate((link) => link.href);
  await page.goto(href, { waitUntil: 'networkidle2' })
  return 'ru'
};