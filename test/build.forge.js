async function clone() {
    await sh("git config something");
    await sh("git clone something");
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

    await linear({
        build: {
            sh: "mvn clean install"
        },
    })

    switch (PLATFORM) {
        case WINDOWS:
            await sh("echo %Apple%");
        case LINUX:
            await sh("echo $Apple");
        case MACOS:
            await sh("echo $Apple");
    }

    switch (PLATFORM) {
        case WINDOWS:
            await sh("echo windows");
        case LINUX:
            await sh("echo linus");
        case MACOS:
            await sh("echo macOs");
    }

}

// await ModuleA();
// ModuleA()

pipeline = {
    agent: {
        docker: {
            image: "maven"
        },
    },
    environment: {
        GIT_USERNAME: cred("GIT_USERNAME"),
    },
    steps: {
        clone: clone,
        build: {
            path: "",
            sh: {
                update_deps: "mvn versions",
                install: "mvn clean install",
            }
        },
        push: {
            windows: {
                sh: ""
            },
            linux: {
                sh: ""
            },
            darwin: {}
        }
    }
}