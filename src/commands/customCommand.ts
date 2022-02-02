import {Command} from "../interfaces/Command";
import {Context} from "../interfaces/Context";
import {Utility} from "../utility/utility";
import {Step} from "../models/BuildScript";

const chalk = require('chalk');

export async function executeCommand(commands: string | string[]) {
    if (Array.isArray(commands)) {
        for (const cmd of commands) {
            console.log("--> executing command %s", chalk.green(cmd));
            await Utility.execute(cmd);
        }
    }
    if (typeof (commands) === "string") {
        console.log("--> executing command %s", chalk.green(commands));
        await Utility.execute(commands);
    }
}


export class CustomProfileCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        if (context.getProfile() != null) {
            for (const profileBuild of step.profiles) {
                if (context.getProfile() === profileBuild.profile) {
                    console.log("profile %s", profileBuild.profile);
                    await executeCommand(step.command)
                }
            }
        } else {
            console.log("profile not found");
        }
    }

}

export class CustomCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        await executeCommand(step.command);
    }

}
