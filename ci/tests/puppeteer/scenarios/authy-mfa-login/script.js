const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await browser.newPage();
    await page.goto("https://localhost:8443/cas/login?authn_method=mfa-authy");
    await cas.loginWith(page, "casuser", "Mellon");

    await page.waitForTimeout(1000)

    await cas.assertVisibility(page, '#token')

    await browser.close();
})();
