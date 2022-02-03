import {Step} from "../models/BuildScript";
import {Context} from "../../interfaces/Context";

export interface Command {
    process(context: Context, step: Step): Promise<void>;
}
