import {Forge} from "./Forge";
import {program} from "commander";
import {Logger} from "./logging/Logger";

const logger = Logger.getLogger("main");

program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<script>", 'script to execute in forge file')
    .option('-p, --profile <profile>', 'profiles')
    .option('-f, --buildFile <buildFile>', 'build file')
    .action(async (args: string, options: { values: string, profile: string, buildFile: string }) => {
        let forge = new Forge();
        let buildFile = options.buildFile == null ? "build.forge.js" : options.buildFile;
        await forge.executeScript(args, buildFile, options.profile);
    });

async function main() {
    program.parse(process.argv);
}

main().catch((e: Error) => logger.error(e.message));
