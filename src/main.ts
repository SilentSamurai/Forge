import {executeYaml} from "./yaml/Forge";
import {executeScript} from "./script/Forge";
import {program} from "commander";
import {Logger} from "./logging/Logger";

const logger = Logger.getLogger("main");

program.command("yaml")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml yaml file')
    .option('-v, --values <valuesFile>', 'values file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeYaml(args, options.values, options.profile);
    });

program.command("script")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml yaml file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeScript(args, options.profile);
    });

async function main() {
    program.parse(process.argv);
}

main().catch((e: Error) => logger.error(e.message));
