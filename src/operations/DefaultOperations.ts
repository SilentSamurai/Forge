import path from "path";
import {Utility} from "../utility/utility";
import {Context} from "../interfaces/Context";
import chalk from "chalk";
import {Logger} from "../logging/Logger";
import {Operation} from "../annotation/ForgeAnnotation";
import {FileOperations} from "./FileOperations";

const logger = Logger.getLogger("operations");

export class DefaultOperations {

    @Operation
    public async sh(context: Context, params: any) {
        if (typeof (params) === "string") {
            await this.execute(context, params);
        }
        let ignoreError = false;
        if (params.hasOwnProperty("ignoreError")) {
            ignoreError = params.ignoreError;
        }
        if (params.hasOwnProperty("cmd")) {
            if (ignoreError) {
                await this.executeNoThrow(context, params.cmd);
            } else {
                await this.execute(context, params.cmd);
            }
        }
        if (typeof (params) === "object") {
            for (const key in params) {
                await this.sh(context, params[key]);
            }
        }
    }

    @Operation
    public async cd(context: Context, pathString: string) {
        if (!path.isAbsolute(pathString)) {
            pathString = path.join(context.getCwd(), pathString);
        }
        if (!Utility.pathExists(pathString)) {
            throw Error(pathString + " not found.");
        }
        logger.info("changing directory to %s", pathString);
        await process.chdir(pathString);
    }

    @Operation
    public async env_set(context: Context, params: any) {
        for (const key in params) {
            process.env[key] = params[key];
        }
    }

    @Operation
    public async env(context: Context, key: string) {
        return process.env[key];
    }

    @Operation
    public async executeNoThrow(context: Context, commands: string) {
        logger.info("executing command %s", chalk.green(commands));
        return await Utility.execute(commands);
    }

    @Operation
    public async execute(context: Context, commands: string | string[]) {
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

    @Operation
    public profile(context: Context, profile: string) {
        return context.isProfileActive(profile);
    }

    @Operation
    public print(context: Context, message: string) {
        logger.info(chalk.blue(message));
    }

    @Operation
    public contains(context: Context, params: any): boolean {
        return params.left.includes(params.right);
    }

    @Operation
    public cred(context: Context, id: string): string {
        return id;
    }


    @Operation
    public async cp(context: Context, param: { from: string, to: string }): Promise<void> {
        await FileOperations.copy(param.from, param.to);
    }

    @Operation
    public async mv(context: Context, param: { from: string, to: string }): Promise<void> {
        await FileOperations.move(param.from, param.to);
    }

    @Operation
    public async rm(context: Context, param: { file: string, recursive: boolean }): Promise<void> {
        await FileOperations.rm(param);
    }
}
