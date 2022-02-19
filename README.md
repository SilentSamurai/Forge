# Forge

cross-platform build tool

![example workflow](https://github.com/SilentSamurai/Forge/actions/workflows/main.yml/badge.svg)

### Example Build Script - Js

```javascript
async function Backend() {
    await cd("backend");
    await execute("mvn clean install -P=local");
    const exeObj = await execute("docker stat");
    if (exeObj.exitCode == 0) {
        await execute("docker build . -t sd25/ims-backend")
    } else {
        print("docker deamon not started")
    }
}

async function Frontend() {
    await cd("frontend");
    await execute("echo \"test\"");
}

async function HelmCharts() {
    await cd("helm-charts");
    const exeObj = await execute("minikube status");
    if (!contains(exeObj.output, "Running")) {
        print("minikube not running")
    }
    await execute("helm version");
}


await Backend()
await Frontend()
await HelmCharts()
```

### command to run the build

```shell
forge build example.forge
```

### Example Script 2

```javascript
async function ModuleA() {
    await cd("moduleA");
    await execute("echo apple-pei");
    await set_env("Apple", "pie");
    await execute("echo %Apple%");

    switch (PLATFORM) {
        case "windows":
            await execute("echo windows");
            break;
        case "linux":
            await execute("echo linus");
            break;
        case "macOs":
            await execute("echo macOs");
            break;
    }

}


await ModuleA();
// ModuleA()

```

### Example Build Script - pipeline

```js
async function clone() {
    await sh('echo "git config something"');
    await sh('echo "git clone something"');
}


async function ModuleA() {
    await cd("");
    await sh("echo apple-pei");
    await set_env("Apple", "pie");

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

```

### command to run the build

```shell
forge yaml example.yaml
```
