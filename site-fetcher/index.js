import cheerio from "cheerio";
import puppeteer from "puppeteer";
const { load } = cheerio;

export const getSiteInfo = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();
    return content;
  } catch (err) {
    console.error(err);
  }
}

export const getSiteData = (html, filter) => {
  const data = [];
  const $ = load(html);
  $(filter).each((i, elem) => {
    data.push({
      title: $(elem).text().trim(),
    });
  })
  return data;
}
