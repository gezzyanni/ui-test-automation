import { After, Before } from '@wdio/cucumber-framework';
import { AjaibLoginAndPIN, AjaibLoginWithoutPin } from '../features/shared.steps.js';
import { restartApp } from '../../src/utils/common.util.js';


Before({ tags: "@login_as_a_margin_trading_user" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("margin_trading_user");
});

Before({ tags: "@login_as_a_reguler_trading_user" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("reguler_trading_user");
});

Before({ tags: "@login_as_a_day_trading_user" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("day_trading_user");
});

After({ tags: "@auth_login" }, async function () {
    browser.reset();
});

Before({ tags: "@regular" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("regular");
});

Before({ tags: "@regularbosbas" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("regularbosbas");
});

Before({ tags: "@auth_pin" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginWithoutPin("auth_pin");
});

Before({ tags: "@login_without_pin_kyc_inactive" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginWithoutPin("kyc_inactive_account");
});

Before({ tags: "@login_without_pin_kyc_active" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginWithoutPin("kyc_account");
});

Before({ tags: "@notkycyet" }, async function () {
    await restartApp();
    this.credentials = await AjaibLoginAndPIN("not_kyc_yet");
});