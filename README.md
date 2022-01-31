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
                type: cp.command
                command:
                    - mvn clean install -P=local
                    - docker build . -t sd25/ims-backend
    -   name: Frontend
        path: frontend
        steps:
            -   step: Build Frontend
                type: cp.command
                command:
                    - echo "test"

    -   name: Helm Charts
        path: helm-charts
        steps:
            -   step: Helm Backend
                type: cp.command
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
                type: cp.command
                command:
                    - mvn clean install -P=local
                    - docker build . -t {{ moduleA.imageName }}
    -   name: Frontend
        path: frontend
        steps:
            -   step: Build Frontend
                type: cp.command
                command:
                    - echo "test"

    -   name: Helm Charts
        path: helm-charts
        steps:
            -   step: Helm Backend
                type: cp.command
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
