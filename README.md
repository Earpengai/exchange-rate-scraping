# Scraping NBC, NSSF Cambodia Exchange Rate
This sample project demonstrates how to scrape data from the website and convert the text to JSON data.
The main reason is I've tried to find any API to connect and couldn't found, I create this sample project just to share the knowledge.
# How it works
Clone this project
```sh
npm install
```
Copy environment file
```sh
cp .env.example .env
```
.env sample
```diff
PORT=3000
NBC_WEBSITE=https://www.nbc.gov.kh/english/economic_research/exchange_rate.php
NSSF_WEBSITE=https://www.nssf.gov.kh/language/en
GDT_WEBSITE=https://www.tax.gov.kh/en/exchange-rate
 ```
Run Command
```sh
npm start
```

1. NBC Exchange Rate: http://localhost:3000/nbc-exr-rate with param ?date=xxxx-xx-xx
3. NSSF Exchange Rate: http://localhost:3000/nssf-exr-rate
4. GDT Website(NBC Exchange Rate): http://localhost:3000/exr-rate
