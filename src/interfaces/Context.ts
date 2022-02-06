export interface Context {
    getCwd(): string;

    isProfileActive(profile: string): boolean;

}

export class ContextImpl implements Context {

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
