import { ANDROID_STAGING_BASE_PACKAGE_NAME } from '../config/constant.conf.js';
import { config as sharedConfig } from '../config/wdio.shared.conf.js'

export const restartApp = async () => {
    if (!sharedConfig.firstAppStart) {
        await driver.reset();
    }

    sharedConfig.firstAppStart = false;
}

export const locatorStrategy = (selector) => {
    return driver.isIOS ? `id=${selector}` : `//*[@content-desc="${selector}"]`;
}

export const accessbilityLocatorStrategy = (selector) => {
    return `~${selector}`;
}

// https://github.com/facebookarchive/WebDriverAgent/wiki/Class-Chain-Queries-Construction-Rules
export const iosClassChainLocatorStrategy = (selector) => {
    return `-ios class chain:${selector}`;
}

// https://github.com/facebookarchive/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules
export const iosPredicateLocatorStrategy = (selector) => {
    return `-ios predicate string:${selector}`;
}

export const locatorStrategyByText = (selector) => {
    return `//*[@text="${selector}"]`;
}

export const hideKeyboard = async () => {
    // The hideKeyboard is not working on ios devices, so take a different approach
    if (!(await driver.isKeyboardShown())) {
        return;
    }

    if (driver.isIOS) {
        await $('id=Return').click();
    } else {
        try {
            await driver.hideKeyboard('pressKey', 'Done');
        } catch (e) {
            // Fallback
            await driver.back();
        }
    }

    // Wait for the keyboard animation to be done
    await driver.pause(750);
}

export const getTextOfElement = async (el) => {
    let visualText = '';
    try {
        if (driver.isAndroid) {
            const elements = await el.$$('*//android.widget.TextView');
            for (let elm of elements) {
                visualText = `${visualText} ${await elm.getText()}`;
            }
        } else {
            visualText = await el.getText();
        }
    } catch (error) {
        visualText = await el.getText();
    }

    return visualText.trim();
}


export const openDeepLinkUrl = async (url) => {
    // since we are using onelink so the protocol isnt bundle name
    const prefix = 'https://';

    if (driver.isAndroid) {

        let BASE_APP_PACKAGE = `${process.env.ENVIRONMENT.trim()}` == "staging" ? ANDROID_STAGING_BASE_PACKAGE_NAME : "ajaib.co.id";
        // Life is so much easier
        return driver.execute('mobile:deepLink', {
            url: `${prefix}${url}`,
            package: BASE_APP_PACKAGE,
        });
    }

    // We can use `driver.url` on iOS simulators, but not on iOS real devices. The reason is that iOS real devices
    // open Siri when you call `driver.url('')` to use a deep link. This means that real devices need to have a different implementation
    // then iOS sims
    // iOS sims and real devices can be distinguished by their UDID. Based on these sources there is a diff in the UDIDS
    // - https://blog.diawi.com/2018/10/15/2018-apple-devices-and-their-new-udid-format/
    // - https://www.theiphonewiki.com/wiki/UDID
    // iOS sims have more than 1 `-` in the UDID and the UDID is being
    const simulatorRegex = new RegExp('(.*-.*){2,}');

    // Check if we are a simulator
    if ('udid' in driver.capabilities && simulatorRegex.test(driver.capabilities.udid?.toString())) {
        await driver.url(`${prefix}${url}`);
    } else {
        // Else we are a real device and we need to take some extra steps
        // Launch Safari to open the deep link
        await driver.execute('mobile: launchApp', {
            bundleId: 'com.apple.mobilesafari',
        });

        // Add the deep link url in Safari in the `URL`-field
        // This can be 2 different elements, or the button, or the text field
        // Use the predicate string because  the accessibility label will return 2 different types
        // of elements making it flaky to use. With predicate string we can be more precise
        const addressBarSelector =
            "name CONTAINS 'URL' OR name CONTAINS 'TabBarItemTitle' OR value contains 'Search or enter website name'";
        const urlFieldSelector =
            'type == "XCUIElementTypeTextField" && name CONTAINS "URL"';
        const addressBar = $(`-ios predicate string:${addressBarSelector}`);
        const urlField = $(`-ios predicate string:${urlFieldSelector}`);

        // Wait for the url button to appear and click on it so the text field will appear
        // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
        if (!(await driver.isKeyboardShown())) {
            await addressBar.waitForDisplayed();
            await addressBar.click();
        }

        // Submit the url and add a break
        await urlField.setValue(`${prefix}${url}\uE007`);
    }

    // Wait for the notification and accept it
    // When using an iOS simulator you will only get the pop-up once, all the other times it won't be shown
    try {
        const openSelector =
            "type == 'XCUIElementTypeButton' && name CONTAINS 'Open'";
        const openButton = $(`-ios predicate string:${openSelector}`);
        // Assumption is made that the alert will be seen within 2 seconds, if not it did not appear
        await openButton.waitForDisplayed({ timeout: 3000 });
        await openButton.click();
    } catch (e) {
        // ignore
        console.log('Deeplink error = ', e);
    }
}

export const getRandomNumberByTimestamp = () => {
    return Math.floor(Date.now() / 1000);
}