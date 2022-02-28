import {CustomStep, Pipeline, ProfileStep, Step, Tasks} from "../models/pipeline";
import {Logger} from "../logging/Logger";
import {Context} from "../interfaces/Context";
import {CommonUtil} from "../utility/commons";
import {Operations} from "../operations/operations";
import chalk from "chalk";

const logger = Logger.getLogger("Forge");


export class PipelineHelper {

    static WINDOWS = 1;
    static DARWIN = 2;
    static LINUX = 3;

    static PLATFORM = PipelineHelper.configurePlatform();

    static context: Context;


    static setupContext(buildScript: string, profileString: string) {
        PipelineHelper.context = CommonUtil.setupContext(buildScript, profileString)
    }

    static configurePlatform() {
        switch (process.platform) {
            case "aix":
                return PipelineHelper.LINUX;
            case "android":
                return PipelineHelper.LINUX;
            case "freebsd":
                return PipelineHelper.LINUX;
            case "linux":
                return PipelineHelper.LINUX;
            case "openbsd":
                return PipelineHelper.LINUX;
            case "win32":
                return PipelineHelper.WINDOWS;
            case "darwin":
                return PipelineHelper.DARWIN;
        }
    }

}


export class PipelineProcessor {

    public static TASKS = new Map<string, Function>();

    static PLATFORM_SET = new Set(["windows", "darwin", "linux"]);


    isPlatformSpecific(step: Step) {
        for (const key of Object.keys(step)) {
            if (PipelineProcessor.PLATFORM_SET.has(key)) {
                return true;
            }
        }
        return false;
    }

    isCustom(step: Step) {
        let keys = new Set(Object.keys(step));
        return keys.has("custom");
    }

    async processProfileTask(profileTask: ProfileStep) {
        if (PipelineHelper.PLATFORM == PipelineHelper.WINDOWS) {
            for (let task in profileTask.windows) {
                await this.processTask(task, profileTask.windows[task]);
            }
        }
        if (PipelineHelper.PLATFORM == PipelineHelper.DARWIN) {
            for (let task in profileTask.darwin) {
                await this.processTask(task, profileTask.darwin[task]);
            }
        }
        if (PipelineHelper.PLATFORM == PipelineHelper.LINUX) {
            for (let task in profileTask.linux) {
                await this.processTask(task, profileTask.darwin[task]);
            }
        }
    }

    async processTask(name: string, task: Tasks) {
        logger.info("running", chalk.green(name));
        let taskFunction = PipelineProcessor.TASKS.get(name);
        if (taskFunction != null) {
            await taskFunction(task);
        } else {
            logger.info("task not found ", name, task);
        }
    }


    async processCustomStep(step: CustomStep) {
        await step.custom();
    }


    async processPipeline(pipeline: Pipeline) {
        for (const env in pipeline.environment) {
            await Operations.set_env(PipelineHelper.context, env, pipeline.environment[env])
        }


        for (const name in pipeline.steps) {
            logger.info("running", chalk.green(name));

            const step = pipeline.steps[name];

            if (this.isPlatformSpecific(step)) {
                await this.processProfileTask(step as ProfileStep);
            } else if (this.isCustom(step)) {
                await this.processCustomStep(step as CustomStep);
            } else {
                for (let task in step) {
                    await this.processTask(task, step[task]);
                }
            }

        }
    }
}

