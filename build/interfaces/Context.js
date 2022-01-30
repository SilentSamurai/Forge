"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ContextImpl = void 0;

class ContextImpl {
    setCwd(path) {
        this.currentCwd = path;
    }

    setProfile(profile) {
        this.profile = profile;
    }

    getCwd() {
        return this.currentCwd;
    }

    getProfile() {
        return this.profile;
    }
}

exports.ContextImpl = ContextImpl;
