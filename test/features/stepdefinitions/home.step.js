import { Given, When } from '@wdio/cucumber-framework';
import homeScreen from '../../../src/screens/home.screen.js';

Given("User verify toggle to switch language", async function (step) {
   await homeScreen.clickToggleLanguage();
});

When("User switch and verify language to ENGLISH", async function (step) {
   await homeScreen.verifyIdLanguage();
});

When("User switch and verify language to INDONESIA", async function (step) {
   await homeScreen.verifyEnLanguage();
});