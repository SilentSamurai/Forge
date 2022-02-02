import {Command} from "../interfaces/Command";
import {Context} from "../interfaces/Context";
import {Step} from "../models/BuildScript";


export class Environment implements Command {

    async process(context: Context, step: Step): Promise<void> {
        for (const environment in step.envVariables) {
            process.env[environment] = step.envVariables[environment];
        }
    }

}
