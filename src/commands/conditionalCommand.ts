import {Command} from "../interfaces/Command";
import {Step} from "../models/BuildScript";
import {Context} from "../interfaces/Context";
import {Utility} from "../utility/utility";
import {executeCommand} from "./customCommand";

export class ConditionalCommand implements Command {
    async process(context: Context, step: Step): Promise<void> {
        let output = await Utility.execute(step.condition.command);
        let cond = (step.condition.contains != null && output.includes(step.condition.contains))
            || (step.condition.notContains != null && !output.includes(step.condition.notContains));

        if (cond) {
            await executeCommand(step.command);
        }
    }

}
