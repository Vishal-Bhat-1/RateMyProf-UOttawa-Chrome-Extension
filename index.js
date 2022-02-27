let scrape = document.querySelectorAll('span[class="PSLONGEDITBOX"]').innerText;
const puppeteer = require('puppeteer');
(async()=>{
let ratingsUrl = 'https://www.ratemyprofessors.com/search/teachers?query=*&sid=1452' ;
let browser = await puppeteer.launch();
let page = await browser.newPage();
await page.goto(ratingsUrl, {waitUntil: "networkidle2"}); //Wait 2 secs for page to load before scraping
let content = await page.evaluate(() => {
    let prof = document.querySelectorAll('div[class="CardName__StyledCardName-sc-1gyrgim-0 cJdVEK"]').innerText; //nodeList of all professors on the site
    let rating = document.querySelectorAll('div[class="CardNumRating__CardNumRatingNumber-sc-17t4b9u-2 kMhQxZ"]').innerText;
    let numOfRatings = document.querySelectorAll('div[class="CardNumRating__CardNumRatingCount-sc-17t4b9u-3 jMRwbg"]').innerText;
    for (let index = 0; index < prof.length; index++) {
        for (let index2 = 0; index2 < scrape.length; index2++) {
            if (prof[index] in scrape[index2]) {
                scrape[index2].src = prof[index] + " " + rating[index] + " " + numOfRatings
            }


            
        }
    }
    //return prof,rating, numOfRatings;

});
await browser.close();
debugger;

}
)();



