const fs = require('fs');
const {spawn} = require("child_process");
const path = require('path');
import {splitSpacesExcludeQuotes} from 'quoted-string-space-split';

export class ExecutionOutput {


    error: Error | null;
    cmdProcess: any;
    output: string;

    constructor(cmdProcess: any, output: string, error: Error | null) {
        this.cmdProcess = cmdProcess;
        this.output = output;
        this.error = error;
    }
}

export class Utility {

    public static execShellCommand(cmd: string, args: Array<string> | null, printOutput: boolean = true): Promise<ExecutionOutput> {
        // console.info("executing: ", cmd);

        if (args == null) {
            const split = splitSpacesExcludeQuotes(cmd);
            cmd = split[0]
            args = split.slice(1);
        }

        console.debug("executing: ", cmd, args);

        return new Promise<ExecutionOutput>((resolve, reject) => {
            const cmdProcess = spawn(cmd, args, {stdio: [process.stdin, "pipe", process.stderr], shell: true});
            let output = "";
            cmdProcess.stdout.on("data", (data: string) => {
                output += `${data}`;
            });
            if (printOutput) {
                cmdProcess.stdout.pipe(process.stdout);
            }
            cmdProcess.on('error', (error: Error) => {
                reject(new ExecutionOutput(cmdProcess, output, error));
            });
            cmdProcess.on("close", () => {
                resolve(new ExecutionOutput(cmdProcess, output, null));
            });

        });
    }

    public static executeWithArgs(cmd: string, args: Array<string>) {
        return this.execShellCommand(cmd, args);
    }

    public static execute(cmd: string) {
        return this.execShellCommand(cmd, null);
    }

    public static pathExists(path: string) {
        return fs.existsSync(path);
    }

    public static createDirectories(pathname: string) {
        const __dirname = path.resolve();
        pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z0-9]+|\/$/g, '');
        fs.mkdirSync(path.resolve(__dirname, pathname), {recursive: true}, (e: Error) => {
            if (e) {
                console.error(e);
            } else {
                console.log('Success');
            }
        });
    }

    public static copyFileSync(source: string, target: string) {
        let targetFile = target;

        // If target is a directory, a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }

        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    public static getAllFiles(source: string, ext: string, outFiles: Array<string>) {
        let that = this;
        if (fs.lstatSync(source).isDirectory()) {
            let files = fs.readdirSync(source);
            files.forEach(function (file: string) {

                let curSource: string = path.join(source, file);
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

    public static copyFilesRecursively(source: string, target: string, ext: string) {
        let files: Array<string> = [];
        this.getAllFiles(source, ext, files);
        let that = this;

        let targetFolder = path.resolve(target);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }

        files.forEach(file => {
            that.copyFileSync(file, targetFolder);
        })
    }

    public static copyFolderRecursiveSync(source: string, target: string, ext: string) {
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
            files.forEach(function (file: string) {

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
