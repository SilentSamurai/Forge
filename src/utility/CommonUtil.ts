import fs from "fs";
import {CustomStep, ProfileStep} from "../models/script";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger("CommonUtil");

export class CommonUtil {

    static PLATFORM_SET = new Set(["windows", "darwin", "linux"]);

    public static loadFile(filePath: string) {
        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    }

    public static isPlatformSpecific(step: any): step is ProfileStep {
        for (const key of Object.keys(step)) {
            if (CommonUtil.PLATFORM_SET.has(key)) {
                return true;
            }
        }
        return false;
    }

    public static isCustom(step: any): step is CustomStep {
        let keys = new Set(Object.keys(step));
        return keys.has("custom");
    }

}
