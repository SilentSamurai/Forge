import {Command} from "../interfaces/Command";
import {Context} from "../../interfaces/Context";
import {Step} from "../models/BuildScript";


export class Environment implements Command {

    async process(context: Context, container: string, step: Step): Promise<void> {

    }

}
