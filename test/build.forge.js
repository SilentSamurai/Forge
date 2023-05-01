const sh = fg.sh;
const cd = fg.cd;

async function clone() {
    await sh('echo "git config something"');
    await sh('echo "git clone something"');
}


async function ModuleA() {
    await cd("");
    await sh("echo apple-pei");
    await fg.env_set("Apple", "pie");

    if (fg.profile("Deployment")) {
        await sh("echo Deployment");
    }

    switch (PLATFORM) {
        case WINDOWS:
            await sh("echo %Apple%");
        case LINUX:
            await sh("echo $Apple");
        case DARWIN:
            await sh("echo $Apple");
    }

    switch (PLATFORM) {
        case WINDOWS:
            await sh("echo windows");
        case LINUX:
            await sh("echo linus");
        case DARWIN:
            await sh("echo macOs");
    }

}

// await ModuleA();
// ModuleA()

scripts = {

    scriptA: {
        environment: {
            GIT_USERNAME: fg.cred("GIT_USERNAME"),
        },
        steps: {
            clone: {
                custom: ModuleA
            },
            build: {
                path: "",
                sh: {
                    update_deps: 'echo "mvn version"',
                    install: 'echo "mvn clean install"',
                }
            },
            push: {
                sh: "echo windows",
                windows: {
                    sh: "echo windows"
                },
                linux: {
                    sh: "echo linux"
                },
                darwin: {
                    sh: "echo darwin"
                }
            },
            copy: {
                path: ".",
                sh: "echo pwd ",
                cp: {
                    from: "settings.xml",
                    to: "new-cp"
                },
                mv: {
                    from: "new-cp/settings.xml",
                    to: "settings-cp.xml"
                },
                rm: "settings-cp.xml"
            }
        }
    },

    scriptB: {}

}
