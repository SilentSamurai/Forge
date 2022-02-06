import {ContextImpl} from "../interfaces/Context";
import path from "path";
import fs from "fs";


export class CommonUtil {


    public static setupContext(buildScript: string, profile: string[]) {
        const context = new ContextImpl();
        let buildpath = path.join(process.cwd(), buildScript);
        context.setCwd(path.dirname(buildpath))
        context.extendProfile(profile);
        return context;
    }

    public static loadFile(filePath: string) {
        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    }

}
