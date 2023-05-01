import {Utility} from "../utility/utility";
import fs from "fs";
import path from "path";

const {promisify} = require('util');
const copy = promisify(require('copy'));
const mv = promisify(require('mv'));

export class FileOperations {

    public static resolvePath(soruce: string) {
        let changingPath;
        if (path.isAbsolute(soruce)) {
            changingPath = soruce;
        } else {
            changingPath = path.join(process.cwd(), soruce)
        }
        return changingPath;
    }

    public static async copy(soruce: string, destination: string) {
        soruce = FileOperations.resolvePath(soruce);
        destination = FileOperations.resolvePath(destination);
        if (fs.existsSync(soruce) && fs.existsSync(destination)) {
            if (fs.lstatSync(soruce).isFile() && fs.lstatSync(destination).isFile()) {
                Utility.copyFileSync(soruce, destination);
                return;
            }
        }
        const files = await copy(soruce, destination);
    }

    public static async move(soruce: string, destination: string) {
        await mv(soruce, destination);
    }

    public static async rm(fileFolder: string) {
        if (fs.lstatSync(fileFolder).isFile()) {
            fs.unlinkSync(fileFolder);
        } else {
            fs.rmdirSync(fileFolder);
        }
    }

}
