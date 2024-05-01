import { config as sharedConfig } from './wdio.shared.conf.js';

const config =  {
    ...sharedConfig,
    ...{
        services: (sharedConfig.services ? sharedConfig.services : []).concat([
            ['chromedriver'],
            'shared-store'
        ])
    }
}

export default config;
