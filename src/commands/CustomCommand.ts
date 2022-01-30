import {Command} from "../interfaces/Command";
import {Context} from "../interfaces/Context";
import {Utility} from "../utility/utility";
import {Step} from "../models/BuildScript";


export class CustomProfileCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        if (context.getProfile() != null) {
            for (const profileBuild of step.profiles) {
                if (context.getProfile() === profileBuild.profile) {
                    console.log("Profile %s", profileBuild.profile);
                    await Utility.execute(profileBuild.command);
                }
            }
        } else {
            console.log("profile not found");
        }

    }

}

export class CustomCommand implements Command {

    async process(context: Context, step: Step): Promise<void> {
        console.log("Cross platform command %s", step.command);
        await Utility.execute(step.command);
    }

}
