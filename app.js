const express = require("express")
const puppeteer = require('puppeteer')
const dotenv = require('dotenv').config()
const app = express()
const PORT = process.env.PORT
const NBC_WEBSITE = process.env.NBC_WEBSITE
const NSSF_WEBSITE = process.env.NSSF_WEBSITE
const GDT_WEBSITE = process.env.GDT_WEBSITE

app.get('/nbc-exr-rate', (req, res) => {
    const date = req.query.date ?? '';
    scrapeNBC(date).then(function(data) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    })
    .catch(function (e) {
        res.status(500, {
            error: e
        });
    });
});

app.get('/nssf-exr-rate', (req, res) => {
    scrapeNSSF().then(function(data) {
        res.send(data);
    })
    .catch(function (e) {
        res.status(500, {
            error: e
        });
    });
});

app.get('/exr-rate', (req, res) => {
    scrapeExchangeRate().then(function(data) {
        res.send(data);
    })
    .catch(function (e) {
        res.status(500, {
            error: e
        });
    });
});

app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`);
});

async function scrapeNBC(date) {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(NBC_WEBSITE, { waitUntil: 'domcontentloaded' });

    await page.focus('#datepicker');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(date);
    await page.click('input[type="submit"]');

    let data = await page.evaluate(() => {
        let date = document.querySelector("#fm-ex > table > tbody > tr:nth-child(1) > td > font").innerText
        let rate = document.querySelector("#fm-ex > table > tbody > tr:nth-child(2) > td > font").innerText
        return {exchange_date: date, exchange_rate: rate};
    });
    await browser.close();
    return data;
}

async function scrapeNSSF() {
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        // Navigate the page to a URL
        await page.goto(NSSF_WEBSITE, { waitUntil: 'domcontentloaded' });

        let data = await page.evaluate(() => {
            let text = document.querySelector("div.nssf-blockcontent > div > ul > li:nth-child(1) > a:nth-child(3)").innerText;
            let splitText = text.split(" ");
            let exchangeRate = splitText[splitText.length - 2];
            let month = new Date(Date.parse(splitText[2] +" 1, 2000")).getMonth()+1;
            let exchangeMonth = splitText[3] + "-" + month;
            return {
                exchange_month: exchangeMonth,
                exchange_rate: exchangeRate,
                data: text
            };
        });
        await browser.close();
        return data;
    }
    catch (e) {
        console.log(e);
        browser.close();
    }
}


async function scrapeExchangeRate() {
    try {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        // Navigate the page to a URL
        await page.goto(GDT_WEBSITE, { waitUntil: 'networkidle0' });

        let data = await page.evaluate(() => {
            let rows = Array.from(document.querySelectorAll("#data-container tr"));
            let lists = Array.from(rows, row => {
                let cols = row.querySelectorAll('td');
                return {
                    exchange_date: cols[0].innerText.split("\n")[0],
                    exchange_symbol: cols[1].innerText,
                    exchange_rate: cols[2].innerText
                };
            });
            return {
                current_exchange_rate: {
                    exchange_date: document.querySelector('.current-date').innerText,
                    exchange_rate: document.querySelector('.moul').innerText.split(" ")[0],
                },
                exchange_lists: lists
            };
        });
        await browser.close();
        return data;
    }
    catch (e) {
        console.log(e);
        browser.close();
    }
}

