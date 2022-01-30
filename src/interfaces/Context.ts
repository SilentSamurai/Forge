export interface Context {
    getCwd(): string;

    getProfile(): string;
}

export class ContextImpl implements Context {

    profile: string | undefined;
    currentCwd: string | undefined;

    setCwd(path: string) {
        this.currentCwd = path;
    }

    setProfile(profile: string) {
        this.profile = profile;
    }

    getCwd(): string {
        return this.currentCwd as string;
    }

    getProfile(): string {
        return this.profile as string;
    }

}
