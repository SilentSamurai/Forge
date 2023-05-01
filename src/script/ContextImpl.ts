import {Context} from "../interfaces/Context";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger("commons");

export class ContextImpl implements Context {

    profile: Set<string> = new Set<string>();
    currentCwd: string;

    constructor(currentCwd: string) {
        this.currentCwd = currentCwd;
    }

    addProfile(profile: string) {
        this.profile.add(profile);
    }

    extendProfile(profile: string[]) {
        profile.forEach(value => this.profile.add(value));
    }

    public getCwd(): string {
        return this.currentCwd as string;
    }

    public isProfileActive(profile: string): boolean {
        return this.profile.has(profile);
    }

}
