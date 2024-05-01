import fs from 'fs'
import path from 'path'
import log from '@wdio/logger'
import { parse } from 'csv-parse'
import { getValue, setValue } from '@wdio/shared-store-service'


class Auth {

    #_log;

    constructor() {
        this.#_log = log('ajaib-auth-logger');
    }

    async initCredentials() {
        let csvPath = path.join(process.cwd(), './src/data/credentials.csv');
        let authData = [];
        let self = this;

        fs.createReadStream(csvPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {

                authData.push({
                    "username": row[0],
                    "password": row[1],
                    "pin": row[2],
                    "type": row[3],
                    "enc": (row[4] === 'true'),
                    "used": false
                });
            })
            .on("end", function () {
                self.#_log.info("finished")

                if (authData.length == 0) {
                    throw Error("Please provide credentials within csv file");
                }
            })
            .on("error", function (error) {
                self.#_log.error(error.message)
            });



        await setValue('auth', authData);
    }

    async getCredentialsFor(type) {


        if (type === null) {
            throw Error("Please provide what type credential you wish for, can't be null");
        }

        //fetch data according to criteria
        let authData = await getValue('auth');
        let index = authData.findIndex((x => x.type === type && !x.used));
        let credentials = authData[index];

        //update that data flag to indicate being used
        authData[index].used = true;
        await setValue('auth', authData);

        //return the fetched data
        return credentials;
    }

    async disposeCredentialsFor(credentials) {

        if (credentials.username === null) {
            throw Error("Please provide an username/email to be disposed, can't be null");
        }

        //fetch data according to criteria
        let authData = await getValue('auth');
        let index = authData.findIndex((x => x.username === credentials.username));

        if (authData[index] != null) {
            //update that data flag to indicate being disposed
            authData[index].used = false;
            await setValue('auth', authData);
        }
        else {
            this.#_log.error(`the session for user ${credentials.username} was not found`.toUpperCase());
        }

    }

    async readCredentialDataOnly(type) {
        if (type === null) {
            throw Error("Please provide what type credential you wish for, can't be null");
        }

        //fetch data according to criteria
        let authData = await getValue('auth');
        let index = authData.findIndex((x => x.type === type));

        let credentials = authData[index];

        //return the fetched data
        return credentials;
    }
}

export default new Auth();
