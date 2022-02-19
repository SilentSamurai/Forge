export interface Environment {
    [key: string]: string;
}


export interface Step {
    [key: string]: Tasks;
}

export interface CustomStep extends Step {
    custom: Function;
}

export interface ProfileStep extends Step {
    windows: Tasks;
    darwin: Tasks;
    linux: Tasks
}

export interface Tasks {
    [key: string]: any;
}

export interface Steps {
    [key: string]: Step;
}

export interface Pipeline {
    environment: Environment;
    steps: Steps;
}


