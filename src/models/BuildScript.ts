export interface ProfileBuild {
    profile: string;
    command: string;
}

export interface Step {
    step: string;
    type: string;
    command: string | string[];
    profiles: ProfileBuild[];
}

export interface BuildScript {
    name: string;
    steps: Step[];
}
