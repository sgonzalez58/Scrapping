const puppeteer = require('puppeteer')
const dotenv = require("dotenv").config();

const scrapLinkedin = async () =>  {
    try {
        const browser = await puppeteer.launch({
            headless: 'false'
        })
        const page = await browser.newPage()

        const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36";

        await page.setUserAgent(userAgent);
        await page.setViewport({width: 1200, height:800})

        const url = "https://www.linkedin.com/search/results/content/?keywords=d%C3%A9veloppeurs%20web%20%23hiring&origin=GLOBAL_SEARCH_HEADER&sid=N0O"

        await page.goto(url, {waitUntil : 'domcontentloaded'})
        const title = await page.title()

        console.log(title)

        await page.type("#username", process.env.LINKEDIN_MAIL)
        await page.type("#password", process.env.LINKEDIN_PASSWORD)
        await page.click("button[type=submit]")
        await page.waitForNavigation()

        const title2 = await page.title()

        console.log(title2)

        const items = await page.evaluate(() => {
            const data = [];
            const errors = [];
            
                document.querySelectorAll('.fie-impression-container').forEach(item => {
                    const name = item.querySelector('.tCqSeCKEjUOUmfJJlPWxQlsjwLwkNfLajoUM')?.innerText.trim() || "Nom inconnu";
                    const hashtagLink = item.querySelector('.update-components-text a.qWdktykoofflQLeAqgrGCGVRzijLcViJI ');
                    let hashtag = hashtagLink ? hashtagLink.innerText : null;
                    let date = item.querySelector('.update-components-actor__sub-description').innerText
            
                    if (hashtag) {
                        data.push({ name, hashtag, date });
                    }
                });
            
                return { data, errors };
        })
        console.log("fin de la récupération")
        if(items.data.length === 0) throw new Error('0 hiring found')
        if(items.errors.length !== 0){
            items.errors.forEach(e => console.error(e))
        }
        console.log("Nombre annonces trouvées : ", items.data.length)
        
        console.log(items.data)

        await browser.close()

    }catch(e){
        console.error(e);
        return
    }
}

scrapLinkedin()