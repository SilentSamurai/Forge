"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
const Forge_1 = require("./Forge");
const {program} = require('commander');

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        program.parse(process.argv);
    });
}

program.command("build")
    .description('Cross Platform Build Tools')
    .argument("<buildFile>", 'yaml build file')
    .option('-v, --values <valuesFile>', 'values file')
    .option('-p, --profile <profile>', 'values file')
    .action((args, options) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("running build with ", args, options);
        yield (0, Forge_1.executeScript)(args, options.values, options.profile);
    }));
main().catch(e => console.error(e));
