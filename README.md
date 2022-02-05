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

### Example Build Script - Yaml

```yaml
api: v1
name: Build
modules:
    -   name: Backend
        path: backend
        steps:
            -   step: Build War & Docker Image
                type: basic.command
                command:
                    - mvn clean install -P=local
                    - docker yaml . -t sd25/ims-backend

    -   name: Frondend
        path: frontend
        steps:
            -   step: Add environment variables
                type: basic.env
                envVariables:
                    stage: production

            -   step: Conditional Command
                type: basic.command.condition
                condition:
                    command: echo "ulalalallalala loop"
                    not:
                        contains: loop
                        exitcode: 0
                    contains: loop
                    exitcode: 0
                command: 
                    - npm i 
                    - npm yaml
                    - npm publish

    -   name: Helm Charts
        path: helm-charts
        steps:
            -   step: Helm Backend
                type: basic.command
                command:
                    - minikube start
                    - helm install backend backend

```

### command to run the build

```shell
forge yaml example.yaml
```

### script the build file

```yaml
api: v1
name: Build
modules:
    -   name: Backend
        path: backend
        steps:
            -   step: Build War & Docker Image
                type: basic.command
                command:
                    - mvn clean install -P=local
                    - docker yaml . -t {{ moduleA.imageName }}

    -   name: Helm Charts
        path: helm-charts
        steps:
            -   step: Helm Backend
                type: basic.command
                command:
                    - minikube start
                    - helm install backend backend
```

### values.yaml

```yaml
## moduleA
moduleA:
    environment: production
    imageName: username/image-name
```

### command to run the build

```shell
forge yaml example.yaml -v values.yaml
```
