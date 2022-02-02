# Forge

cross-platform build tool

![example workflow](https://github.com/SilentSamurai/Forge/actions/workflows/main.yml/badge.svg)

### Example Build Script

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
                    - docker build . -t sd25/ims-backend

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
                    - npm build
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
forge build example.yaml
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
                    - docker build . -t {{ moduleA.imageName }}

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
forge build example.yaml -v values.yaml
```
