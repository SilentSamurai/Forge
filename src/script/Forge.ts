import {CommonUtil} from "../utility/commons";
import {Operations} from "../operations/operations";
import {ExecutionOutput} from "../utility/utility";
import {Logger} from "../logging/Logger";
import {Build} from "../models/build";
import {PipelineHelper, PipelineProcessor} from "./helpers";

const logger = Logger.getLogger("Forge");

const chalk = require('chalk');

const WINDOWS = PipelineHelper.WINDOWS;
const DARWIN = PipelineHelper.DARWIN;
const LINUX = PipelineHelper.LINUX;


const PLATFORM = PipelineHelper.PLATFORM;


async function cd(path: string) {
    await Operations.cd(PipelineHelper.context, path)
}

async function sh(command: string): Promise<ExecutionOutput> {
    return await Operations.executeNoThrow(PipelineHelper.context, command);
}

async function set_env(key: string, value: string) {
    await Operations.set_env(PipelineHelper.context, key, value);
}

async function get_env(key: string, value: string) {
    return await Operations.get_env(PipelineHelper.context, key);
}

function profile(profile: string) {
    return PipelineHelper.context.isProfileActive(profile);
}

function print(message: string) {
    logger.info(chalk.blue(message));
}

function contains(string1: string, string2: string): boolean {
    return string1.includes(string2);
}

function cred(id: string): string {
    return id;
}

let build: Build;


PipelineProcessor.TASKS.set("path", cd);
PipelineProcessor.TASKS.set("set_env", set_env);
PipelineProcessor.TASKS.set("sh", async (cmd: string | { [key: string]: string }) => {
    if (typeof (cmd) === "string") {
        await sh(cmd);
    }
    if (typeof (cmd) === "object") {
        for (const key in cmd) {
            await sh(cmd[key])
        }
    }
});


export async function executeScript(buildScript: string, profileString: string) {
    try {

        PipelineHelper.setupContext(buildScript, profileString);
        let scriptJs = CommonUtil.loadFile(buildScript);
        scriptJs = "\"use strict\"; async function main() { " +
            scriptJs +
            " } \nmain().catch((e) => console.error(chalk.red(e.message)));";

        // logger.info(scriptJs);

        const output = eval(scriptJs);
        logger.info("Pipeline ", build)

        if (build != null) {
            let pipelineProcessor = new PipelineProcessor();
            await pipelineProcessor.processPipeline(build);
        }


    } catch (e: any) {
        logger.error(chalk.red(e.message));
        logger.debug(e.stack);
    }
}
