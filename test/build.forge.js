async function ModuleA() {
    await cd("moduleA");
    await execute("echo apple-pei");
    await set_env("Apple", "pie");

    if (profile("Deployment")) {
        await execute("echo Deployment");
    }

    switch (PLATFORM) {
        case WINDOWS:
            await execute("echo %Apple%");
        case LINUX:
            await execute("echo $Apple");
        case MACOS:
            await execute("echo $Apple");
    }

    switch (PLATFORM) {
        case WINDOWS:
            await execute("echo windows");
        case LINUX:
            await execute("echo linus");
        case MACOS:
            await execute("echo macOs");
    }

}


await ModuleA();
// ModuleA()
