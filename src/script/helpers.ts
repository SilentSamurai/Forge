import {Logger} from "../logging/Logger";
import {Context} from "../interfaces/Context";

const logger = Logger.getLogger("Forge");


export class PipelineHelper {

    static WINDOWS = 1;
    static DARWIN = 2;
    static LINUX = 3;

    static PLATFORM = PipelineHelper.configurePlatform();

    static context: Context;

    static configurePlatform() {
        switch (process.platform) {
            case "aix":
                return PipelineHelper.LINUX;
            case "android":
                return PipelineHelper.LINUX;
            case "freebsd":
                return PipelineHelper.LINUX;
            case "linux":
                return PipelineHelper.LINUX;
            case "openbsd":
                return PipelineHelper.LINUX;
            case "win32":
                return PipelineHelper.WINDOWS;
            case "darwin":
                return PipelineHelper.DARWIN;
        }
    }

}


