import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as Yaml from "js-yaml";
import {CdCommand} from "./commands/cd";
import {CustomCommand, CustomProfileCommand} from "./commands/CustomCommand";
import {BuildScript, Step} from "./models/BuildScript";
import {Command} from "./interfaces/Command";
import {Context, ContextImpl} from "./interfaces/Context";

const chalk = require("chalk");

const commands: Map<string, Command> = new Map<string, Command>();
commands.set("basic.cd", new CdCommand());
commands.set("cp.profile.command", new CustomProfileCommand());
commands.set("cp.command", new CustomCommand());

async function processScript(buildFileObject: BuildScript, context: Context) {
    console.log("running script %s", chalk.green('"' + buildFileObject.name + '"'))
    let step: Step;
    for (step of buildFileObject.steps) {
        console.log("--> executing step %s", chalk.green('"' + step.step + '"'));
        const command: Command | undefined = commands.get(step.type);
        if (command != null) {
            await command.process(context, step);
        } else {
            console.log("step type %s unknown", step.type);
        }
    }
    console.log("artifact(s) forged.")
}


function loadValues(filePath: string) {
    const valueFile = fs.readFileSync(filePath, {encoding: 'utf-8'})
    return Yaml.load(valueFile);
}

export async function executeScript(buildScript: string, valuesYaml: string, profile: string) {
    const values = valuesYaml != null ? await loadValues(valuesYaml) : {};

    const yamlFile = fs.readFileSync(buildScript, {encoding: 'utf-8'})
    const yamlTemplate = Handlebars.compile(yamlFile);
    const resultYamlFile = yamlTemplate(values);

    const buildFile: BuildScript = Yaml.load(resultYamlFile) as BuildScript;

    const context = new ContextImpl();
    context.setCwd(process.cwd())
    context.setProfile(profile);

    await processScript(buildFile, context);
}
