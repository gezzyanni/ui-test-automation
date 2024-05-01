import sharedConfig from './wdio.shared.local.web.conf.js';
import path from 'path'

export const config = {
    ...sharedConfig,
    ...{
        suites: {
            local: [
                [
                    path.join(process.cwd(),  './test/features/featureFiles/home.feature')
                ]
            ]
        },
        capabilities: [{
            // capabilities for local web tests
            browserName: 'chrome',
            'goog:chromeOptions':{
                binary:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                args: [
                    '--disable-notifications',
                    '--use-fake-device-for-media-stream',  // Use a fake device for media stream
                    '--use-fake-ui-for-media-stream',     // Use a fake UI for media stream
                    '--incognito'
                ]
            }
        }],
    }
}

