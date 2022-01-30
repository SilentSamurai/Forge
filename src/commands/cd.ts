import {Command} from "../interfaces/Command";

import * as path from "path";
import {Context} from "../interfaces/Context";
import {Utility} from "../utility/utility";

export class CdCommand implements Command {

    async process(context: Context, step: any): Promise<void> {
        if (!path.isAbsolute(step.path)) {
            step.path = path.join(context.getCwd(), step.path);
        }
        console.log("changing directory to %s", step.path);
        if (!Utility.pathExists(step.path)) {
            throw Error(step.path + " not found.");
        }
        await process.chdir(step.path);
    }

}
