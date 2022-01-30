import {Context} from "./Context";
import {Step} from "../models/BuildScript";

export interface Command {
    process(context: Context, step: Step): Promise<void>;
}
