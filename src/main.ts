import {executeScript} from "./script/Forge";
import {program} from "commander";
import {Logger} from "./logging/Logger";

const logger = Logger.getLogger("main");

program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'forge file')
    .option('-p, --profile <profile>', 'profiles')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeScript(args, options.profile);
    });

async function main() {
    program.parse(process.argv);
}

main().catch((e: Error) => logger.error(e.message));
