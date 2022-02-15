import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {CommandStep} from "../models/BuildScript";
import {Operations} from "../../operations/operations";
import {Logger} from "../../logging/Logger";

const chalk = require('chalk');

const logger = Logger.getLogger("customCommands");

export async function executeCommand(context: Context, commands: string | string[]) {
    await Operations.execute(context, commands);
}


export class CustomCommand implements Command {

    async process(context: Context, container: string, step: CommandStep): Promise<void> {
        if (Array.isArray(step.command)) {
            for (const cmd of step.command) {
                const command = `docker exec --workdir=${step.workdir} ${container} ${cmd}`
                await executeCommand(context, command);
            }
        }
        if (typeof (step.command) === "string") {
            const command = `docker exec --workdir=${step.workdir} ${container} ${step.command}`
            await executeCommand(context, command);
        }
    }

}
