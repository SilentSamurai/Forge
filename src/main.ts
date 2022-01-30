import {executeScript} from "./Forge";

const {program} = require('commander');

async function main() {
    program.parse(process.argv);
}

program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml build file')
    .option('-v, --values <valuesFile>', 'values file')
    .option('-p, --profile <profile>', 'values file')
    .action(async (args: string, options: { values: string, profile: string }) => {
        console.log("running build with ", args, options);
        await executeScript(args, options.values, options.profile);
    });


main().catch(e => console.error(e));
