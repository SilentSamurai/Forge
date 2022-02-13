import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Step} from "../models/BuildScript";
import {Operations} from "../../operations/operations";
import {Logger} from "../../logging/Logger";

const chalk = require('chalk');

const logger = Logger.getLogger("customCommands");

export async function executeCommand(context: Context, commands: string | string[]) {
    await Operations.execute(context, commands);
}


export class CustomProfileCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        for (const profileBuild of step.profiles) {
            if (context.isProfileActive(profileBuild.profile)) {
                logger.info("profile %s", profileBuild.profile);
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
