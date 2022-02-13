export const WINDOWS = 1;
export const MACOS = 2;
export const LINUX = 3;


export function configurePlatform() {

    switch (process.platform) {
        case "aix":
            return LINUX;
        case "android":
            return LINUX;
        case "freebsd":
            return LINUX;
        case "linux":
            return LINUX;
        case "openbsd":
            return LINUX;
        case "win32":
            return WINDOWS;
        case "darwin":
            return MACOS;
    }
}
