import {Command} from "../interfaces/Command";
import {Context} from "../interfaces/Context";
import {Utility} from "../utility/utility";
import {Step} from "../models/BuildScript";

const chalk = require('chalk');


export class CustomProfileCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        if (context.getProfile() != null) {
            for (const profileBuild of step.profiles) {
                if (context.getProfile() === profileBuild.profile) {
                    console.log("");
                    console.log("profile %s", profileBuild.profile);
                    console.log("--> executing command %s", chalk.green(step.command));
                    await Utility.execute(profileBuild.command);
                }
            }
        } else {
            console.log("profile not found");
        }

    }

}

export class CustomCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {

        if (Array.isArray(step.command)) {
            for (const cmd of step.command) {
                console.log("");
                console.log("--> executing command %s", chalk.green(step.command));
                await Utility.execute(cmd);
            }
        }
        if (typeof (step.command) === "string") {
            console.log("");
            console.log("--> executing command %s", chalk.green(step.command));
            await Utility.execute(step.command);
        }
    }

}
