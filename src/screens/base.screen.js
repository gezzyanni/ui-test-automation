import { DEFAULT_TIMEOUT } from "../config/constant.conf.js";

export default class BaseScreen {

    #selector;


    constructor(selector) {
        if (typeof selector !== "undefined" && selector !== null) {
            this.#selector = selector;
        } else {
            this.#selector = 'body';
        }

    }

    /**
     * Custom wait for some element to be shown or not
     * @param {Boolean} isShown to indicate wether the element is shown but the state is visible or not, by default is true
     * @returns {Boolean} state of the element is shown or not
     */
    async waitForIsShown(isShown = true) {
        try {
            await (await $(this.#selector)).waitForDisplayed({
                timeout: DEFAULT_TIMEOUT,
                reverse: !isShown
            });

            const isDisplayed = await (await $(this.#selector)).isDisplayed();

            return !!isDisplayed;
        } catch (e) {
            return !isShown;
        }
    }


    /**
     * Custom wait for some element to be exist or not
     * @param {Boolean} isExist to indicate wether the element is exist but the state is exist or not, by default is true
     * @returns {Boolean} state of the element is exist or not
     */
    async waitForIsExisting(isExist = true) {
        try {
            const result = await (await $(this.#selector)).waitForExist({
                timeout: DEFAULT_TIMEOUT,
                reverse: !isExist
            });

            return !!result;
        } catch (e) {
            return !isExist;
        }
    }

    /**
     * 
     * @param {WebdriverIO.Element} el 
     */
    async dismissButtonIfStillExist(el) {
        try {

            await el.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });

            while (await el.isDisplayed()) {

                await el.click();
                // Add a short delay if needed, sometimes interactions may need time to settle
                await driver.pause(500);
            }
        } catch (error) {
            // Handle errors, e.g., log them or take appropriate action
            throw Error("Error during dismissing:", error.message);
        }
    }


}