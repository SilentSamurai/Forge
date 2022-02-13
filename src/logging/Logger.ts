import chalk from "chalk";
import dateFormat from "dateformat";

export class Logger {

    constructor(readonly name: string) {
    }

    public static getLogger(name: string) {
        return new Logger(name);
    }

    formatDate() {
        return dateFormat(new Date(), "yyyy-mm-dd h:MM:ss TT");
    }

    info(message?: string, ...optionalParams: any[]) {
        console.log(`[${this.formatDate()}] [${this.name}] : ${message} `, ...optionalParams)
    }

    error(message?: string, exception: Error | null = null) {
        if (exception != null) {
            console.log(chalk.red(`[${this.formatDate()}] [${this.name}] : ${message} `), exception);
        }
        console.log(chalk.red(`[${this.formatDate()}] [${this.name}] : ${message} `));
    }

    debug(stack: any) {
        console.debug(stack);
    }
}
