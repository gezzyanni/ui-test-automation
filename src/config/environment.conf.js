import dotenv from 'dotenv'
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseConfig = async () => {

    console.log("PARSING CONFIG");

    if (process.env.ENVIRONMENT) {
        console.log(`GETTING CONFIG FROM PATH ${path.resolve(`${__dirname}/../../.env/`, `${process.env.ENVIRONMENT.trim()}.env`)}`)
        dotenv.config({ path: path.resolve(`${__dirname}/../../.env/`, `${process.env.ENVIRONMENT.trim()}.env`) });
    } else {
        throw Error("Please define the environtment for e.g. staging/production");
    }
};