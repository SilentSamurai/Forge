async function windows() {

    await execute("docker network create jenkins");

    const dockerDind = `docker run --name jenkins-docker --rm --detach ^
                          --privileged --network jenkins --network-alias docker ^
                          --env DOCKER_TLS_CERTDIR=/certs ^
                          --volume jenkins-docker-certs:/certs/client ^
                          --volume jenkins-data:/var/jenkins_home ^
                          --publish 2376:2376 ^
                          docker:dind`;
    await execute(dockerDind);

    await execute("docker build -t myjenkins-blueocean:2.319.3-1 .");

    const dockerCmd = `
            docker run --name jenkins-blueocean --rm --detach ^
          --network jenkins --env DOCKER_HOST=tcp://docker:2376 ^
          --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 ^
          --volume jenkins-data:/var/jenkins_home ^
          --volume jenkins-docker-certs:/certs/client:ro ^
          --publish 8080:8080 --publish 50000:50000 myjenkins-blueocean:2.319.3-1
    `

    await execute(dockerCmd);
}

async function macAndLinus() {

    await execute("docker network create jenkins");

    const dockerDind = `docker run \\
                          --name jenkins-docker \\
                          --rm \\
                          --detach \\
                          --privileged \\
                          --network jenkins \\
                          --network-alias docker \\
                          --env DOCKER_TLS_CERTDIR=/certs \\
                          --volume jenkins-docker-certs:/certs/client \\
                          --volume jenkins-data:/var/jenkins_home \\
                          --publish 2376:2376 \\
                          docker:dind \\
                          --storage-driver overlay2`;
    await execute(dockerDind);

    const dockerCMD = `
    docker run --name jenkins-docker --rm --detach \\
          --privileged --network jenkins --network-alias docker \\
          --env DOCKER_TLS_CERTDIR=/certs \\
          --volume jenkins-docker-certs:/certs/client \\
          --volume jenkins-data:/var/jenkins_home \\
          --publish 2376:2376 \\
          docker:dind --storage-driver overlay2`;

    await execute(dockerCMD);

    await execute("docker build -t myjenkins-blueocean:2.319.3-1 .");

    const dockerCmd = `
           docker run \\
                  --name jenkins-blueocean \\
                  --rm \\
                  --detach \\
                  --network jenkins \\
                  --env DOCKER_HOST=tcp://docker:2376 \\
                  --env DOCKER_CERT_PATH=/certs/client \\
                  --env DOCKER_TLS_VERIFY=1 \\
                  --publish 8080:8080 \\
                  --publish 50000:50000 \\
                  --volume jenkins-data:/var/jenkins_home \\
                  --volume jenkins-docker-certs:/certs/client:ro \\
                  myjenkins-blueocean:2.319.3-1 
    `

    await execute(dockerCmd);

}


switch (PLATFORM) {
    case WINDOWS:
        await windows();
        break;
    case LINUX:
    case MACOS:
        await macAndLinus();
        break;
}
