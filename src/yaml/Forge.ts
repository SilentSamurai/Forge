import * as Handlebars from "handlebars";
import * as Yaml from "js-yaml";
import {BuildScript, Module, Step} from "./models/BuildScript";
import {Command} from "./interfaces/Command";
import {Context} from "../interfaces/Context";
import {Environment} from "./commands/environment";
import {CommonUtil} from "../utility/commons";
import {Logger} from "../logging/Logger";
import {Operations} from "../operations/operations";
import {CustomCommand} from "./commands/customCommand";
import {FromContainer, ToContainer} from "./commands/transfer";

const chalk = require("chalk");
const logger = Logger.getLogger("yaml.Forge");

const commands: Map<string, Command> = new Map<string, Command>();
commands.set("basic.command", new CustomCommand());
commands.set("basic.transfer.from.container", new FromContainer());
commands.set("basic.transfer.to.container", new ToContainer());
commands.set("basic.env", new Environment());

async function processScript(buildFileObject: BuildScript, context: Context) {
    logger.info("forging yaml %s", chalk.green('"' + buildFileObject.name + '"'));
    for (let module of buildFileObject.modules) {
        await processModule(module, context);
    }
    logger.info(chalk.green('"' + buildFileObject.name + '"'), "artifact(s) forged.")
}

async function processModule(module: Module, context: Context) {
    logger.info("forging module %s", chalk.green('"' + module.name + '"'));

    await Operations.execute(context, `docker run -d -t --name ${module.container} --entrypoint=bash ${module.image}`)

    let step: Step;
    for (step of module.steps) {
        logger.info("executing step %s", chalk.green('"' + step.step + '"'));
        const command: Command | undefined = commands.get(step.type);
        if (command != null) {
            await command.process(context, module.container, step);
        } else {
            logger.info("step type %s unknown", step.type);
            throw new Error("unknown step " + step.type);
        }
    }
    await Operations.execute(context, `docker stop ${module.container}`)
    await Operations.execute(context, `docker rm ${module.container}`)
    logger.info(chalk.green('"' + module.name + '"'), "module forged.")
}


function loadValues(filePath: string) {
    const valueFile = CommonUtil.loadFile(filePath);
    return Yaml.load(valueFile);
}

export async function executeYaml(buildScript: string, valuesYaml: string) {
    try {
        const values = valuesYaml != null ? await loadValues(valuesYaml) : {};

        const yamlFile = CommonUtil.loadFile(buildScript);
        const yamlTemplate = Handlebars.compile(yamlFile);
        const resultYamlFile = yamlTemplate(values);

        const buildFile: BuildScript = Yaml.load(resultYamlFile) as BuildScript;

        const context = CommonUtil.setupContext(buildScript, null);

        await processScript(buildFile, context);
    } catch (e: any) {
        logger.error(e.message);
    }

}
