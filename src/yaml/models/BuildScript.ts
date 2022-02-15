export interface Step {
    step: string;
    type: string;
}

export interface CommandStep extends Step {
    workdir: string;
    command: string | string[];
}

export interface TransferStep extends Step {
    source: string;
    destination: string;
}

export interface Module {
    name: string;
    image: string;
    steps: Step[];
    environment: {};
    container: string;
}

export interface BuildScript {
    name: string;
    modules: Module[];
}
