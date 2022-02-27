/*
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
*/
//document.getElementById("MTG_INSTR$" + "0").innerHTML

//document.getElementById("DERIVED_CLS_DTL_SSR_INSTR_LONG$1").innerHTML



/*
 * Sends the professor names to be checked and returns a response with content
 * that will be injected into the page
 */
function getScores(name, element) {
	$(element).append($("<p class='rmp-loading'>Loading!</p>"));
	let url = `https://www.ratemyprofessors.com/search/teachers?query=*&sid=1452`;
	var el = element;
	fetch(url).then(function (reponse) {
		return reponse.json();
	}).then(function (myJson) {
		createElements(myJson, el);
	});
}
async function checkDivs() {
	console.log('checking...');
	let instructorNames = [];
	let divs = [];
	for(let x=0; x<300; x++) {
		if (!!document.getElementById("MTG_INSTR$" + x.toString()).innerHTML) {
			divs = divs + document.getElementById("MTG_INSTR$" + x.toString()).innerHTML;
		}
	}
	/*
	let divs = document.querySelectorAll("DERIVED_CLS_DTL_SSR_INSTR_LONG$");
	let count = 0;
	while (divs.length == 0 && count < 20) {
		await sleep(200);
		divs = document.querySelectorAll("DERIVED_CLS_DTL_SSR_INSTR_LONG$");
		count++;
	}
	*/
	if (divs.length > 0) {
		divs.forEach(function (el) {
			let instructorName = el.children[0];
			if (instructorName != null) {
				let insideText = instructorName.innerText;
				if (insideText.toLowerCase().includes("view syllabus")) {
					instructorName.innerText = insideText.substr(0, insideText.indexOf("View syllabus"));
					insideText = instructorName.innerText;
				}
				if (!insideText.includes("--")) {
					let splitIt = (insideText).split(" ");
					if (splitIt[1].includes(".") || splitIt[1].length == 1 | splitIt[2] != null) {
						let cleanName = splitIt[0] + " " + splitIt[2];
						instructorName.innerText = cleanName;
					}
					instructorNames.push(instructorName);

				}
			}
		});
		for (let i = 0; i < instructorNames.length; i++) {
			getScores(instructorNames[i].innerText, instructorNames[i]);
		}
	} else {
		console.log("Unable to find professors on this page.");
	}
}

/*
 * Sleep function used to allow for the browser to load the course information
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * Loads creates the HTML elements that will be inserted into the page based
 * on the returned content
 */
function createElements(message, originalEl) {
	if (message.status == "success") {
		let quality = message.overallQuality;
		let takeAgain = message.takeAgain;
		let difficulty = message.difficulty;
		let link = message.url;
		let qualityEl = $(`<p>Overall Quality: ${quality}</p>`);
		let takeAgainEl = $(`<p>Would Take Again: ${takeAgain}</p>`);
		let difficultyEl = $(`<p>Level of Difficulty: ${difficulty}</p>`);
		let linkEl = $(`<a href=${link} target='_blank'>Link</a>`);
		let overallDiv = $("<div></div>");
		$(originalEl).css('text-align', 'center');
		let upperEl = $(originalEl).parents('MTG_INSTR$0');
		overallDiv.append(qualityEl, takeAgainEl, difficultyEl, linkEl);
		overallDiv.addClass("rmp-info");
		$(originalEl).children('.rmp-loading').remove();
		upperEl.append(overallDiv);
	} else {
		$(originalEl).children('.rmp-loading').remove();
		let failedDiv = $('<p>No RMP data!</p>');
		let upperEl = $(originalEl).parents('MTG_INSTR$0');
		upperEl.append(failedDiv);
	}
}




