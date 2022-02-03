const fs = require("fs");
const path = require("path");

const copyJob = {
    "from": "bin/yaml-win.exe",
    "to": "C:/tools/yaml/yaml.exe"
}

let targetFile = copyJob.to;
// If target is a directory, a new file with the same name will be created
if (fs.existsSync(copyJob.to)) {
    if (fs.lstatSync(copyJob.to).isDirectory()) {
        targetFile = path.join(copyJob.to, path.basename(copyJob.from));
    }
}
fs.writeFileSync(targetFile, fs.readFileSync(copyJob.from));
