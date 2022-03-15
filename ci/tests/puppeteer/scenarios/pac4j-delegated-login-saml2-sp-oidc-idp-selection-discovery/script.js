const puppeteer = require('puppeteer');
const cas = require('../../cas.js');
const path = require('path');
const assert = require("assert");

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await cas.newPage(browser);
    await startWithSamlSp(page);
    await startWithCasSp(page);
    await browser.close();
})();

async function startWithCasSp(page) {
    const service = "https://apereo.github.io";
    await page.goto("https://localhost:8443/cas/logout");
    await page.waitForTimeout(1000)
    await page.goto(`https://localhost:8443/cas/login?service=${service}`);
    await cas.assertVisibility(page, '#selectProviderButton')
    await cas.submitForm(page, "#providerDiscoveryForm")
    await page.waitForTimeout(1000)
    await cas.type(page, "#username", "casuser@heroku.org")
    await cas.submitForm(page, "#discoverySelectionForm")
    await page.waitForTimeout(2000)
    await cas.loginWith(page, "casuser", "Mellon");
    await page.waitForTimeout(1000)
    let ticket = await cas.assertTicketParameter(page);
    const body = await cas.doRequest(`https://localhost:8443/cas/p3/serviceValidate?service=${service}&ticket=${ticket}`);
    console.log(body)
    assert(body.includes('<cas:user>casuser</cas:user>'))
}

async function startWithSamlSp(page) {
    await page.goto("https://localhost:8443/cas/logout");

    await page.goto("http://localhost:9443/simplesaml/module.php/core/authenticate.php?as=default-sp");
    await page.waitForTimeout(1000)
    
    await cas.assertVisibility(page, '#selectProviderButton')
    await cas.submitForm(page, "#providerDiscoveryForm")
    await page.waitForTimeout(1000)
    await cas.type(page, "#username", "casuser@example.org")
    await cas.submitForm(page, "#discoverySelectionForm")
    await page.waitForTimeout(2000)
    await cas.loginWith(page, "info@fawnoos.com", "QFkN&d^bf9vhS3KS49",
        "#okta-signin-username", "#okta-signin-password");

    await page.waitForSelector('#table_with_attributes', {visible: true});
    await cas.assertInnerTextContains(page, "#content p", "status page of SimpleSAMLphp");
    await cas.assertVisibility(page, "#table_with_attributes");
    let authData = JSON.parse(await cas.innerHTML(page, "details pre"));
    console.log(authData);
    
    await page.goto("https://localhost:8443/cas/login");
    await cas.assertTicketGrantingCookie(page);
    await cas.removeDirectory(path.join(__dirname, '/saml-md'));
}
