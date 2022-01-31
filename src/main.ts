import {executeScript} from "./Forge";

const {program} = require('commander');


program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml build file')
    .option('-v, --values <valuesFile>', 'values file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        await executeScript(args, options.values, options.profile);
    });

async function main() {
    program.parse(process.argv);
}

main().catch(e => console.error(e));
