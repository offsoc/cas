const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await browser.newPage();
    const context = browser.defaultBrowserContext()
    await context.overridePermissions("https://localhost:8443/cas/login", ['geolocation'])
    await page.setGeolocation({latitude:90, longitude:20})
    await page.goto("https://localhost:8443/cas/login");
    await page.waitForTimeout(1000)

    await cas.loginWith(page, "casuser", "Mellon");
    await page.waitForTimeout(1000)

    let header = await cas.textContent(page, "#content h2");

    assert(header === "Authentication attempt is blocked.")

    header = await cas.textContent(page, "#content p");
    assert(header === "Your authentication attempt is untrusted and unauthorized from your current workstation.")
    
    await browser.close();
})();
