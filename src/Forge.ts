import {ContextImpl} from "./script/ContextImpl";
import {Logger} from "./logging/Logger";
import {GlobalContext, Script} from "./models/script";
import {PipelineHelper} from "./script/helpers";
import {ScriptRunner} from "./script.runner";
import {Context} from "./interfaces/Context";
import path from "path";
import {CommonUtil} from "./utility/CommonUtil";

const logger = Logger.getLogger("Forge");

const chalk = require('chalk');

const WINDOWS = PipelineHelper.WINDOWS;
const DARWIN = PipelineHelper.DARWIN;
const LINUX = PipelineHelper.LINUX;
const PLATFORM = PipelineHelper.PLATFORM;

const fg: GlobalContext = {};

let scripts: { [key: string]: Script };

export class Forge {

    public setupContext(buildScript: string, profileString: string | null): Context {
        let buildpath = path.join(process.cwd(), buildScript);
        let cwd = path.dirname(buildpath)
        const context = new ContextImpl(cwd);
        if (profileString != null) {
            const profiles = profileString.split(",");
            logger.info("Profiles Active : ", profiles);
            context.extendProfile(profiles);
        }
        return context;
    }

    public async executeScript(scriptName: string, buildScript: string, profileString: string) {
        try {
            let context = this.setupContext(buildScript, profileString);
            let scriptRunner = new ScriptRunner(context, fg);
            scriptRunner.processOperations();

            let scriptJs = CommonUtil.loadFile(buildScript);
            scriptJs = "\"use strict\"; async function main() { " +
                scriptJs +
                " } \nmain().catch((e) => console.error(chalk.red(e.message)));";

            // logger.info(scriptJs);

            const output = eval(scriptJs);

            if (scripts != null && scripts.hasOwnProperty(scriptName)) {
                logger.info("Scripts ", scripts[scriptName])
                await scriptRunner.processScript(scripts[scriptName]);
            }

        } catch (e: any) {
            logger.error(chalk.red(e.message));
            logger.debug(e.stack);
        }
    }
}

