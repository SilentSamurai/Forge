import {CustomStep, Environment, GlobalContext, NormalStep, ProfileStep, Script, Task} from "./models/script";
import chalk from "chalk";
import {DefaultOperations} from "./operations/DefaultOperations";
import {PipelineHelper} from "./script/helpers";
import {Logger} from "./logging/Logger";
import {CommonUtil} from "./utility/CommonUtil";
import {Context} from "./interfaces/Context";
import {ForgeAnnotation} from "./annotation/ForgeAnnotation";
import path from "path";

const logger = Logger.getLogger("Forge");

export class ScriptRunner {

    context: Context;
    global: GlobalContext;
    public TASKS = new Map<string, Function>();

    constructor(context: Context, global: GlobalContext) {
        this.context = context;
        this.global = global;
    }

    public processOperations() {
        for (const name in ForgeAnnotation.operations) {
            this.TASKS.set(name, ForgeAnnotation.operations[name]);
            const that = this;
            this.global[name] = async function (task: any) {
                await that.processTask(name, task);
            };
        }
    }

    public async configureEnvironment(environment: Environment) {
        let defaultOperation = new DefaultOperations();
        await defaultOperation.env_set(this.context, environment);
    }

    public async processScript(script: Script) {
        await this.configureEnvironment(script.environment);
        for (const name in script.steps) {
            logger.info("running", chalk.green(name));

            const step = script.steps[name];
            if (step.condition != undefined && step.condition) {
                logger.info("skipping " + name);
                continue;
            }

            if (step.path != undefined) {
                let changingPath;
                if (path.isAbsolute(step.path)) {
                    changingPath = step.path;
                } else {
                    changingPath = path.join(process.cwd(), step.path)
                }
                logger.info("changing path  " + changingPath);
                process.chdir(changingPath);
            }

            if (CommonUtil.isPlatformSpecific(step)) {
                await this.processProfileTask(step);
            } else if (CommonUtil.isCustom(step)) {
                await this.processCustomStep(step);
            } else {
                await this.processNormalStep(step as NormalStep);
            }
        }
    }

    protected async processProfileTask(profileTask: ProfileStep) {
        if (PipelineHelper.PLATFORM == PipelineHelper.WINDOWS) {
            await this.processNormalStep(profileTask.windows as NormalStep);
        }
        if (PipelineHelper.PLATFORM == PipelineHelper.DARWIN) {
            await this.processNormalStep(profileTask.darwin as NormalStep);
        }
        if (PipelineHelper.PLATFORM == PipelineHelper.LINUX) {
            await this.processNormalStep(profileTask.linux as NormalStep);
        }
    }

    protected async processNormalStep(step: NormalStep) {
        for (let taskName in step) {
            if (taskName === "path" || taskName === "condition") continue;
            if (typeof step[taskName] === "boolean") {
                logger.info("skipping $" + taskName);
                continue;
            }
            let task = step[taskName] as Task;
            await this.processTask(taskName, task);
        }
    }

    protected async processTask(name: string, task: Task) {
        logger.info("running", chalk.green(name));
        let taskFunction = this.TASKS.get(name);
        if (taskFunction != null) {
            await taskFunction(this.context, task);
        } else {
            logger.info("task not found ", name, task);
        }
    }

    protected async processCustomStep(step: CustomStep) {
        await step.custom();
    }

}
