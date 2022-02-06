export interface Context {
    getCwd(): string;

    isProfileActive(profile: string): boolean;

}

