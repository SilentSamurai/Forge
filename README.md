# Forge

cross-platform build tool

![example workflow](https://github.com/SilentSamurai/Forge/actions/workflows/main.yml/badge.svg)


### Example Build Script - Pipeline

```js
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

async function clone() {
    await sh('echo "git config something"');
    await sh('echo "git clone something"');
}

```

### command to run the build

```shell
forge build build.forge.js
```


### Example Build Script - with pure Js

```javascript
async function Backend() {
    await cd("backend");
    await sh("mvn clean install -P=local");
    const exeObj = await sh("docker stat");
    if (exeObj.exitCode == 0) {
        await sh("docker build . -t ims-backend")
    } else {
        print("docker deamon not started")
    }
}

async function Frontend() {
    await cd("frontend");
    await sh("echo \"test\"");
}

async function HelmCharts() {
    await cd("helm-charts");
    const exeObj = await sh("minikube status");
    if (!contains(exeObj.output, "Running")) {
        print("minikube not running")
    }
    await sh("helm version");
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
    await sh("echo apple-pei");
    await set_env("Apple", "pie");
    await sh("echo %Apple%");

    switch (PLATFORM) {
        case "windows":
            await sh("echo windows");
            break;
        case "linux":
            await sh("echo linus");
            break;
        case "macOs":
            await sh("echo macOs");
            break;
    }

}


await ModuleA();
// ModuleA()

```
