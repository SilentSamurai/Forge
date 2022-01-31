"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Utility = void 0;
var fs = require('fs');
var spawn = require("child_process").spawn;
var path = require('path');
var Utility = /** @class */ (function () {
    function Utility() {
    }

    Utility.execShellCommand = function (cmd, args, printOutput) {
        // console.info("executing: ", cmd);
        if (printOutput === void 0) {
            printOutput = true;
        }
        if (args == null) {
            var split = cmd.split(" ");
            cmd = split[0];
            args = split.slice(1);
        }
        console.info("executing: ", cmd, args);
        return new Promise(function (resolve, reject) {
            var cmdProcess = spawn(cmd, args, {stdio: [process.stdin, "pipe", process.stderr], shell: true});
            var output = "";
            cmdProcess.stdout.on("data", function (data) {
                output += "".concat(data);
            });
            if (printOutput) {
                cmdProcess.stdout.pipe(process.stdout);
            }
            cmdProcess.on("close", function () {
                resolve(output);
            });
        });
    };
    Utility.executeWithArgs = function (cmd, args) {
        return this.execShellCommand(cmd, args);
    };
    Utility.execute = function (cmd) {
        return this.execShellCommand(cmd, null);
    };
    Utility.pathExists = function (path) {
        return fs.existsSync(path);
    };
    Utility.createDirectories = function (pathname) {
        var __dirname = path.resolve();
        pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z0-9]+|\/$/g, '');
        fs.mkdirSync(path.resolve(__dirname, pathname), {recursive: true}, function (e) {
            if (e) {
                console.error(e);
            } else {
                console.log('Success');
            }
        });
    };
    Utility.copyFileSync = function (source, target) {
        var targetFile = target;
        // If target is a directory, a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    };
    Utility.getAllFiles = function (source, ext, outFiles) {
        var that = this;
        if (fs.lstatSync(source).isDirectory()) {
            var files = fs.readdirSync(source);
            files.forEach(function (file) {
                var curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    that.getAllFiles(curSource, ext, outFiles);
                } else {
                    if (file.endsWith(ext)) {
                        outFiles.push(curSource);
                    }
                }
            });
        }
    };
    Utility.copyFilesRecursively = function (source, target, ext) {
        var files = [];
        this.getAllFiles(source, ext, files);
        var that = this;
        var targetFolder = path.resolve(target);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        files.forEach(function (file) {
            that.copyFileSync(file, targetFolder);
        });
    };
    Utility.copyFolderRecursiveSync = function (source, target, ext) {
        var files = [];
        var that = this;
        // Check if folder needs to be created or integrated
        var targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        // Copy
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                var curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    that.copyFolderRecursiveSync(curSource, targetFolder, ext);
                } else {
                    if (file.endsWith(ext)) {
                        that.copyFileSync(curSource, targetFolder);
                    }
                }
            });
        }
    };
    return Utility;
}());
exports.Utility = Utility;
