"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ContextImpl = void 0;
var ContextImpl = /** @class */ (function () {
    function ContextImpl() {
    }

    ContextImpl.prototype.setCwd = function (path) {
        this.currentCwd = path;
    };
    ContextImpl.prototype.setProfile = function (profile) {
        this.profile = profile;
    };
    ContextImpl.prototype.getCwd = function () {
        return this.currentCwd;
    };
    ContextImpl.prototype.getProfile = function () {
        return this.profile;
    };
    return ContextImpl;
}());
exports.ContextImpl = ContextImpl;
