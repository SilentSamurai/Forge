import * as Handlebars from "handlebars";
import * as Yaml from "js-yaml";
import {CdCommand} from "./commands/cd";
import {CustomCommand, CustomProfileCommand} from "./commands/customCommand";
import {BuildScript, Module, Step} from "./models/BuildScript";
import {Command} from "./interfaces/Command";
import {Context} from "../interfaces/Context";
import {Environment} from "./commands/environment";
import {ConditionalCommand} from "./commands/conditionalCommand";
import {CommonUtil} from "../utility/commons";

const chalk = require("chalk");

const commands: Map<string, Command> = new Map<string, Command>();
commands.set("basic.cd", new CdCommand());
commands.set("basic.profile.command", new CustomProfileCommand());
commands.set("basic.command", new CustomCommand());
commands.set("basic.env", new Environment());
commands.set("basic.command.condition", new ConditionalCommand());

async function processScript(buildFileObject: BuildScript, context: Context) {
    console.log("forging yaml %s", chalk.green('"' + buildFileObject.name + '"'));
    for (let module of buildFileObject.modules) {
        // @ts-ignore
        const command: Command = commands.get("basic.cd");
        await command.process(context, {path: module.path} as any);
        await processModule(module, context);
    }
    console.log(chalk.green('"' + buildFileObject.name + '"'), "artifact(s) forged.")
}

async function processModule(module: Module, context: Context) {
    console.log("forging module %s", chalk.green('"' + module.name + '"'))
    let step: Step;
    for (step of module.steps) {
        console.log("--> executing step %s", chalk.green('"' + step.step + '"'));
        const command: Command | undefined = commands.get(step.type);
        if (command != null) {
            await command.process(context, step);
        } else {
            console.log("step type %s unknown", step.type);
            throw new Error("unknown step " + step.type);
        }
    }
    console.log(chalk.green('"' + module.name + '"'), "module forged.")
}


function loadValues(filePath: string) {
    const valueFile = CommonUtil.loadFile(filePath);
    return Yaml.load(valueFile);
}

export async function executeYaml(buildScript: string, valuesYaml: string, profileString: string) {
    try {
        const values = valuesYaml != null ? await loadValues(valuesYaml) : {};

        const yamlFile = CommonUtil.loadFile(buildScript);
        const yamlTemplate = Handlebars.compile(yamlFile);
        const resultYamlFile = yamlTemplate(values);

        const buildFile: BuildScript = Yaml.load(resultYamlFile) as BuildScript;

        const context = CommonUtil.setupContext(buildScript, profileString);

        await processScript(buildFile, context);
    } catch (e: any) {
        console.error(chalk.red(e.message));
    }

}
