"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Utility = void 0;
const fs = require('fs');
const {spawn} = require("child_process");
const path = require('path');

class Utility {
    static execShellCommand(cmd, args, printOutput = true) {
        // console.info("executing: ", cmd);
        if (args == null) {
            let split = cmd.split(" ");
            cmd = split[0];
            args = split.slice(1);
        }
        console.info("executing: ", cmd, args);
        return new Promise(function (resolve, reject) {
            const cmdProcess = spawn(cmd, args, {stdio: [process.stdin, "pipe", process.stderr], shell: true});
            let output = "";
            cmdProcess.stdout.on("data", (data) => {
                output += `${data}`;
            });
            if (printOutput) {
                cmdProcess.stdout.pipe(process.stdout);
            }
            cmdProcess.on("close", () => {
                resolve(output);
            });
        });
    }

    static executeWithArgs(cmd, args) {
        return this.execShellCommand(cmd, args);
    }

    static execute(cmd) {
        return this.execShellCommand(cmd, null);
    }

    static pathExists(path) {
        return fs.existsSync(path);
    }

    static createDirectories(pathname) {
        const __dirname = path.resolve();
        pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z0-9]+|\/$/g, '');
        fs.mkdirSync(path.resolve(__dirname, pathname), {recursive: true}, (e) => {
            if (e) {
                console.error(e);
            } else {
                console.log('Success');
            }
        });
    }

    static copyFileSync(source, target) {
        let targetFile = target;
        // If target is a directory, a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }
        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    static getAllFiles(source, ext, outFiles) {
        let that = this;
        if (fs.lstatSync(source).isDirectory()) {
            let files = fs.readdirSync(source);
            files.forEach(function (file) {
                let curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    that.getAllFiles(curSource, ext, outFiles);
                } else {
                    if (file.endsWith(ext)) {
                        outFiles.push(curSource);
                    }
                }
            });
        }
    }

    static copyFilesRecursively(source, target, ext) {
        let files = [];
        this.getAllFiles(source, ext, files);
        let that = this;
        let targetFolder = path.resolve(target);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        files.forEach(file => {
            that.copyFileSync(file, targetFolder);
        });
    }

    static copyFolderRecursiveSync(source, target, ext) {
        let files = [];
        let that = this;
        // Check if folder needs to be created or integrated
        let targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        // Copy
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                let curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    that.copyFolderRecursiveSync(curSource, targetFolder, ext);
                } else {
                    if (file.endsWith(ext)) {
                        that.copyFileSync(curSource, targetFolder);
                    }
                }
            });
        }
    }
}

exports.Utility = Utility;
