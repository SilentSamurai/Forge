export interface ProfileBuild {
    profile: string;
    command: string | string[];
}

export interface Condition {
    contains: string;
    command: string;
}

export interface Step {
    step: string;
    type: string;
    command: string | string[];
    profiles: ProfileBuild[];
    envVariables: { [key: string]: string };
    condition: Condition;
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
