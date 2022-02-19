async function clone() {
    await sh('echo "git config something"');
    await sh('echo "git clone something"');
}


async function ModuleA() {
    await cd("moduleA");
    await sh("echo apple-pei");
    await environment({
        Apple: "pie"
    });

    if (profile("Deployment")) {
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

pipeline = {
    environment: {
        GIT_USERNAME: cred("GIT_USERNAME"),
    },
    steps: {
        clone: {
            custom: clone
        },
        build: {
            path: "",
            sh: {
                update_deps: 'echo "mvn version"',
                install: 'echo "mvn clean install"',
            }
        },
        push: {
            windows: {
                sh: "echo windows"
            },
            linux: {
                sh: "echo linux"
            },
            darwin: {
                sh: "echo darwin"
            }
        }
    }
}
