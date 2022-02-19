import {Agent} from "./Agent";

export interface Context {
    getCwd(): string;

    isProfileActive(profile: string): boolean;

    getAgent(): Agent;

}

