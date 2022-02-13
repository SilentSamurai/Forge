async function ModuleA() {
    await cd("moduleA");
    await execute("echo apple-pei");
    await set_env("Apple", "pie");
    await execute("echo %Apple%");

    if (isProfileActive("Deployment")) {
        await execute("echo Deployment");
    }

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