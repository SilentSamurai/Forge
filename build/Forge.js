"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.executeScript = void 0;
const fs = __importStar(require("fs"));
const Handlebars = __importStar(require("handlebars"));
const Yaml = __importStar(require("js-yaml"));
const cd_1 = require("./commands/cd");
const CustomCommand_1 = require("./commands/CustomCommand");
const Context_1 = require("./interfaces/Context");
const chalk = require("chalk");
const commands = new Map();
commands.set("basic.cd", new cd_1.CdCommand());
commands.set("cp.profile.command", new CustomCommand_1.CustomProfileCommand());
commands.set("cp.command", new CustomCommand_1.CustomCommand());

function processScript(buildFileObject, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("running script %s", chalk.green('"' + buildFileObject.name + '"'));
        let step;
        for (step of buildFileObject.steps) {
            console.log("--> executing step %s", chalk.green('"' + step.step + '"'));
            const command = commands.get(step.type);
            if (command != null) {
                yield command.process(context, step);
            } else {
                console.log("step type %s unknown", step.type);
            }
        }
        console.log("process completed with success");
    });
}

function loadValues(filePath) {
    const valueFile = fs.readFileSync(filePath, {encoding: 'utf-8'});
    return Yaml.load(valueFile);
}

function executeScript(buildScript, valuesYaml, profile) {
    return __awaiter(this, void 0, void 0, function* () {
        const values = valuesYaml != null ? yield loadValues(valuesYaml) : {};
        const yamlFile = fs.readFileSync(buildScript, {encoding: 'utf-8'});
        const yamlTemplate = Handlebars.compile(yamlFile);
        const resultYamlFile = yamlTemplate(values);
        const buildFile = Yaml.load(resultYamlFile);
        const context = new Context_1.ContextImpl();
        context.setCwd(process.cwd());
        context.setProfile(profile);
        yield processScript(buildFile, context);
    });
}

exports.executeScript = executeScript;
