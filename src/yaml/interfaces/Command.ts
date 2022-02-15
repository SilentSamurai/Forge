import {Step} from "../models/BuildScript";
import {Context} from "../../interfaces/Context";

export interface Command {
    process(context: Context, container: string, step: Step): Promise<void>;
}
