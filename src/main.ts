import {executeYaml} from "./yaml/Forge";
import chalk from "chalk";
import {executeScript} from "./script/Forge";

const {program} = require('commander');


program.command("yaml")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml yaml file')
    .option('-v, --values <valuesFile>', 'values file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeYaml(args, options.values, options.profile);
    });

program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml yaml file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeScript(args, options.profile);
    });

async function main() {
    program.parse(process.argv);
}

main().catch((e: Error) => console.error(chalk.red(e.message)));
