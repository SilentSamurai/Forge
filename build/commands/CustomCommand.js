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
exports.CustomCommand = exports.CustomProfileCommand = void 0;
const utility_1 = require("../utility/utility");

class CustomProfileCommand {
    process(context, step) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.getProfile() != null) {
                for (const profileBuild of step.profiles) {
                    if (context.getProfile() === profileBuild.profile) {
                        console.log("Profile %s", profileBuild.profile);
                        yield utility_1.Utility.execute(profileBuild.command);
                    }
                }
            } else {
                console.log("profile not found");
            }
        });
    }
}

exports.CustomProfileCommand = CustomProfileCommand;

class CustomCommand {
    process(context, step) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Cross platform command %s", step.command);
            yield utility_1.Utility.execute(step.command);
        });
    }
}

exports.CustomCommand = CustomCommand;
