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

export interface Module {
    name: string;
    path: string;
    steps: Step[];
}

export interface BuildScript {
    name: string;
    modules: Module[];
}
