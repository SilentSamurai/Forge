import path from "path";
import {Utility} from "../utility/utility";
import {Context} from "../interfaces/Context";
import chalk from "chalk";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger("operations");

export class Operations {

    public static async cd(context: Context, pathString: string) {
        if (!path.isAbsolute(pathString)) {
            pathString = path.join(context.getCwd(), pathString);
        }
        if (!Utility.pathExists(pathString)) {
            throw Error(pathString + " not found.");
        }
        logger.info("changing directory to %s", pathString);
        await process.chdir(pathString);
    }


    public static async set_env(context: Context, key: string, value: string) {
        process.env[key] = value;
    }

    public static async get_env(context: Context, key: string) {
        return process.env[key];
    }

    public static async executeNoThrow(context: Context, commands: string) {
        logger.info("executing command %s", chalk.green(commands));
        return await Utility.execute(commands);
    }


    public static async execute(context: Context, commands: string | string[]) {
        if (Array.isArray(commands)) {
            for (const cmd of commands) {
                logger.info("executing command %s", chalk.green(cmd));
                let executionOutput = await Utility.execute(cmd);
                if (executionOutput.cmdProcess.exitCode != 0) {
                    throw new Error("command returned non zero exit code.");
                }
            }
        }
        if (typeof (commands) === "string") {
            logger.info("executing command %s", chalk.green(commands));
            let executionOutput = await Utility.execute(commands);
            if (executionOutput.cmdProcess.exitCode != 0) {
                throw new Error("command returned non zero exit code.");
            }
        }

    }
}
