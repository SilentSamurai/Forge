export interface Environment {
    [key: string]: string;
}


export interface TaskParamObj {
    [key: string]: any
}

export type Task = TaskParamObj | string;

export interface Step {
    condition: boolean,
    path: string,
}

export interface NormalStep extends Step {
    [key: string]: Task | boolean;
}

export interface CustomStep extends Step {
    custom: Function;
}

export interface ProfileStep extends Step {
    windows: Step;
    darwin: Step;
    linux: Step
}


// export interface Tasks { [key: string]: any}

export interface Steps {
    [key: string]: Step;
}

export interface Script {
    environment: Environment;
    steps: Steps;
}

export interface GlobalContext {
    [key: string]: Function
}

