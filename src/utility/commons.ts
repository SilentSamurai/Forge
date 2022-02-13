import {Context} from "../interfaces/Context";
import path from "path";
import fs from "fs";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger("commons");

class ContextImpl implements Context {

    profile: Set<string> = new Set<string>();
    currentCwd: string | undefined;

    setCwd(path: string) {
        this.currentCwd = path;
    }

    addProfile(profile: string) {
        this.profile.add(profile);
    }

    extendProfile(profile: string[]) {
        profile.forEach(value => this.profile.add(value));
    }

    getCwd(): string {
        return this.currentCwd as string;
    }

    isProfileActive(profile: string): boolean {
        return this.profile.has(profile);
    }

}

export class CommonUtil {


    public static setupContext(buildScript: string, profileString: string): Context {
        const context = new ContextImpl();
        let buildpath = path.join(process.cwd(), buildScript);
        context.setCwd(path.dirname(buildpath))
        if (profileString != null) {
            const profiles = profileString.split(",");
            logger.info("Profiles Active : ", profiles);
            context.extendProfile(profiles);
        }
        return context;
    }

    public static loadFile(filePath: string) {
        return fs.readFileSync(filePath, {encoding: 'utf-8'});
    }

}
