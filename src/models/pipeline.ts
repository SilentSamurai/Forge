export interface AgentNode {
    [key: string]: string;
}

export interface AgentModel {
    [key: string]: AgentNode;
}

export interface Environment {
    [key: string]: string;
}

export interface Sh {
    [key: string]: string;
}

export interface Step {
}

export interface Build extends Step {
    path: string;
    sh: Sh;
}

export interface ProfileStep extends Step {
    windows: Build;
    linux: Build;
    darwin: Build;
}


export interface Steps {
    [key: string]: Step;
}

export interface Pipeline {
    agent: AgentModel;
    environment: Environment;
    steps: Steps;
}


