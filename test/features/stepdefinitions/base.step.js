import { Given } from '@wdio/cucumber-framework';
import { logger } from '../../../src/utils/test.util.js';

Given('User visit {string}', async function (url) {
    await browser.url(url);
});

Given('User visit with reload {string}', async function (url) {
    let currentUrl = await browser.getUrl();
    logger.info(currentUrl)
    if (currentUrl.includes("http")) {
        await browser.reloadSession();
    }
    await browser.url(url);
});

