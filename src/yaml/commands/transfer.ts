import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Operations} from "../../operations/operations";
import {TransferStep} from "../models/BuildScript";
import * as path from "path";
import {Logger} from "../../logging/Logger";

const logger = Logger.getLogger("transfer");

export class FromContainer implements Command {

    async process(context: Context, container: string, step: TransferStep): Promise<void> {
        step.destination = path.join(context.getCwd(), step.destination);
        const command = `docker cp "${container}:${step.source}" "${step.destination}"`
        // logger.info("executing command %s", chalk.green(command));
        await Operations.execute(context, command);
    }

}

export class ToContainer implements Command {

    async process(context: Context, container: string, step: TransferStep): Promise<void> {
        step.source = path.join(context.getCwd(), step.source);
        const command = `docker cp "${step.source}" "${container}:${step.destination}"`
        // logger.info("executing command %s", chalk.green(command));
        await Operations.execute(context, command);
    }

}
