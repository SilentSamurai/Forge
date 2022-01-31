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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = {
        label: 0, sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
        }, trys: [], ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;

    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {value: op[1], done: false};
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
    }
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.executeScript = void 0;
var fs = __importStar(require("fs"));
var Handlebars = __importStar(require("handlebars"));
var Yaml = __importStar(require("js-yaml"));
var cd_1 = require("./commands/cd");
var CustomCommand_1 = require("./commands/CustomCommand");
var Context_1 = require("./interfaces/Context");
var chalk = require("chalk");
var commands = new Map();
commands.set("basic.cd", new cd_1.CdCommand());
commands.set("cp.profile.command", new CustomCommand_1.CustomProfileCommand());
commands.set("cp.command", new CustomCommand_1.CustomCommand());
function processScript(buildFileObject, context) {
    return __awaiter(this, void 0, void 0, function () {
        var step, _i, _a, command;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("running script %s", chalk.green('"' + buildFileObject.name + '"'));
                    _i = 0, _a = buildFileObject.steps;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    step = _a[_i];
                    console.log("");
                    console.log("--> executing step %s", chalk.green('"' + step.step + '"'));
                    command = commands.get(step.type);
                    if (!(command != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, command.process(context, step)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log("step type %s unknown", step.type);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("artifact(s) forged.");
                    return [2 /*return*/];
            }
        });
    });
}
function loadValues(filePath) {
    var valueFile = fs.readFileSync(filePath, {encoding: 'utf-8'});
    return Yaml.load(valueFile);
}
function executeScript(buildScript, valuesYaml, profile) {
    return __awaiter(this, void 0, void 0, function () {
        var values, _a, yamlFile, yamlTemplate, resultYamlFile, buildFile, context;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(valuesYaml != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadValues(valuesYaml)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = {};
                    _b.label = 3;
                case 3:
                    values = _a;
                    yamlFile = fs.readFileSync(buildScript, {encoding: 'utf-8'});
                    yamlTemplate = Handlebars.compile(yamlFile);
                    resultYamlFile = yamlTemplate(values);
                    buildFile = Yaml.load(resultYamlFile);
                    context = new Context_1.ContextImpl();
                    context.setCwd(process.cwd());
                    context.setProfile(profile);
                    return [4 /*yield*/, processScript(buildFile, context)];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.executeScript = executeScript;
