export interface Agent {

    setupAgent(args: {}): void;

    completeTask(task: string, args: {}): void;

}
