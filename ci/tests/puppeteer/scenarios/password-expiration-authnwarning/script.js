const puppeteer = require('puppeteer');
const assert = require('assert');
const cas = require('../../cas.js');

(async () => {
    const browser = await puppeteer.launch(cas.browserOptions());
    const page = await browser.newPage();
    await page.goto("https://localhost:8443/cas/login");

    await cas.loginWith(page, "casuser", "Mellon");

    await page.waitForTimeout(1000)

    let header = await cas.textContent(page, "#content h1");

    assert(header === "Authentication Succeeded with Warnings")

    await cas.assertVisibility(page, '#changePassword')

    await cas.innerText(page, '#changePasswordForm');
    await page.waitForTimeout(1000)

    header = await cas.textContent(page, "#pwdmain h3");

    assert(header === "You must change your password.")

    await typePassword(page, "123456", "123456")
    await page.waitForTimeout(1000)
    await cas.assertInvisibility(page, '#password-policy-violation-msg');

    await typePassword(page, "123456", "123")
    await page.waitForTimeout(1000)
    await cas.assertInvisibility(page, '#password-confirm-mismatch-msg');

    await typePassword(page, "Testing1234", "Testing1234")
    await page.waitForTimeout(1000)
    await cas.assertInvisibility(page, '#password-strength-msg');
    await cas.assertInvisibility(page, '#password-strength-notes');

    await typePassword(page, "EaP8R&iX$eK4nb8eAI", "EaP8R&iX$eK4nb8eAI")
    await page.waitForTimeout(1000)
    await cas.assertInvisibility(page, '#password-confirm-mismatch-msg');
    await cas.assertInvisibility(page, '#password-policy-violation-msg');

    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    header = await cas.textContent(page, "#content h2");
    assert(header === "Password Change Successful");

    header = await cas.textContent(page, "#content p");
    assert(header === "Your account password is successfully updated.")

    await cas.innerText(page, '#form');
    await page.waitForTimeout(1000)

    let element = await cas.innerText(page, '#content div h2');
    assert(element === "Log In Successful")

    let tgc = (await page.cookies()).filter(value => value.name === "TGC")
    assert(tgc.length !== 0);

    await page.waitForTimeout(1000)
    await browser.close();
})();


async function typePassword(page, pswd, confirm) {
    await cas.innerText(page, '#password');
    await page.type('#password', pswd);

    await cas.innerText(page, '#confirmedPassword');
    await page.type('#confirmedPassword', confirm);
}
