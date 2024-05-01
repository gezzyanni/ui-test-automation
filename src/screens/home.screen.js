import BaseScreen from './base.screen.js'

class Home extends BaseScreen {
    constructor() {
        super('#content-main');
    }

    get toggleLanguage() {
        return $("#css-sylki2");
    }

    get idLanguage() {
        return $("#css-rrkcqg");
    }

    get idText() {
        return $(`//*[contains(., 'Bebas transaksi')]`);
    }

    get enLanguage() {
        return $("css-f6nt2g");
    }

    get enText() {
        return $(`//*[contains(., 'Free financial transactions')]`);
    }

    async clickToggleLanguage() {
       await (await this.toggleLanguage).click();
    }

    async verifyIdLanguage() {
        await (await this.idLanguage).click();
        await (await this.idText).waitForDisplayed();
    }

    async verifyEnLanguage() {
        await (await this.enLanguage).click();
        await (await this.idLanguage).waitForDisplayed();
    }

}

export default new Home();