import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Step} from "../models/BuildScript";
import {Operations} from "../../operations/operations";

const chalk = require('chalk');

export async function executeCommand(context: Context, commands: string | string[]) {
    await Operations.execute(context, commands);
}


export class CustomProfileCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        for (const profileBuild of step.profiles) {
            if (context.isProfileActive(profileBuild.profile)) {
                console.log("profile %s", profileBuild.profile);
                await executeCommand(context, step.command)
            }
        }
    }
}

export class CustomCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        await executeCommand(context, step.command);
    }

}
