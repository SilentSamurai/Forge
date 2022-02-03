import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Operations} from "../../operations/operations";

export class CdCommand implements Command {

    async process(context: Context, step: any): Promise<void> {
        await Operations.cd(context, step.path);
    }

}
