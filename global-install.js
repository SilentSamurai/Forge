const fs = require("fs");
const path = require("path");

const copyJob = {
    "from": "build/cli/forge-win.exe",
    "to": "C:/tools/forge/forge.exe"
}

let targetFile = copyJob.from;
// If target is a directory, a new file with the same name will be created
if (fs.existsSync(copyJob.from)) {
    if (fs.lstatSync(copyJob.from).isDirectory()) {
        targetFile = path.join(copyJob.from, path.basename(copyJob.to));
    }
}
fs.writeFileSync(targetFile, fs.readFileSync(copyJob.to));
