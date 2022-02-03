import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Step} from "../models/BuildScript";
import {Operations} from "../../operations/operations";


export class Environment implements Command {

    async process(context: Context, step: Step): Promise<void> {
        for (const environment in step.envVariables) {
            await Operations.set_env(context, environment, step.envVariables[environment]);
        }
    }

}
