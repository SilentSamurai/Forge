import path from "path";
import {Utility} from "../utility/utility";
import {Context} from "../interfaces/Context";
import chalk from "chalk";


export class Operations {

    public static async cd(context: Context, pathString: string) {
        if (!path.isAbsolute(pathString)) {
            pathString = path.join(context.getCwd(), pathString);
        }
        if (!Utility.pathExists(pathString)) {
            throw Error(pathString + " not found.");
        }
        console.log("changing directory to %s", pathString);
        await process.chdir(pathString);
    }


    public static async set_env(context: Context, key: string, value: string) {
        process.env[key] = value;
    }

    public static async get_env(context: Context, key: string) {
        return process.env[key];
    }

    public static async executeOne(context: Context, commands: string) {
        console.log("--> executing command %s", chalk.green(commands));
        let executionOutput = await Utility.execute(commands);
        if (executionOutput.cmdProcess.exitCode != 0) {
            throw new Error("command returned non zero exit code.");
        }
        return executionOutput;
    }


    public static async execute(context: Context, commands: string | string[]) {
        if (Array.isArray(commands)) {
            for (const cmd of commands) {
                console.log("--> executing command %s", chalk.green(cmd));
                let executionOutput = await Utility.execute(cmd);
                if (executionOutput.cmdProcess.exitCode != 0) {
                    throw new Error("command returned non zero exit code.");
                }
            }
        }
        if (typeof (commands) === "string") {
            console.log("--> executing command %s", chalk.green(commands));
            let executionOutput = await Utility.execute(commands);
            if (executionOutput.cmdProcess.exitCode != 0) {
                throw new Error("command returned non zero exit code.");
            }
        }

    }
}
