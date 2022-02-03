import {Command} from "../interfaces/Command";
import {Step} from "../models/BuildScript";
import {Context} from "../../interfaces/Context";
import {Utility} from "../../utility/utility";
import {executeCommand} from "./customCommand";

export class ConditionalCommand implements Command {
    async process(context: Context, step: Step): Promise<void> {
        let executionOutput = await Utility.execute(step.condition.command);
        const output = executionOutput.output;
        let cond = false;
        if (step.condition.not != null) {
            cond = cond || (step.condition.not.contains != null && output.includes(step.condition.not.contains));
            cond = cond || (step.condition.not.exitCode != null && executionOutput.cmdProcess.exitCode == step.condition.not.exitCode);
        } else {
            cond = cond || (step.condition.contains != null && output.includes(step.condition.contains));
            cond = cond || (step.condition.exitCode != null && executionOutput.cmdProcess.exitCode == step.condition.exitCode);
        }

        if (cond) {
            await executeCommand(context, step.command);
        }
    }

}
