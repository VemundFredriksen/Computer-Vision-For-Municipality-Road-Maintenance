## REST-API and MongoDB


### Prerequisites

Since Docker has been used on the back-end system, it is easy to get the express-server/REST-API and the database up and running on different operating systems. Nevertheless, there are a few requirements that must be met. First of all; Docker must be installed. For Windows and macOS we recommend to just install the Docker desktop application which also contains docker-compose. For Windows you also need either the Pro, Enterprise or Education version. This is because Docker for Windows requires Hyper-V, and Hyper-V requires one of these editions. For further prerequisites needed to run the system on Windows see [https://docs.docker.com/install/](https://docs.docker.com/install/)

If the system is to be set up on Ubuntu, it has to be on a 64-bit version of one of these versions; Disco 19.04, Cosmic 18.10, Bionic 18.04 or Xenial 16.04. In order to run Docker it is necessary to install docker-ce and docker-compose, for updated instructions on how to do this refer to [https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

MacOS must be of version 10.13 or newer to run Docker and the Mac hardware must be a 2010 or newer model. For further prerequisites needed to run the system on macOS see [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)


### Build

Once you have installed the Docker desktop application on a correct version of Windows, macOS, or Ubuntu one can simply pull down the GitHub repository and run the command _"docker -compose build"._ This makes use of the docker-compose which is a wrapper around the Docker CLI. This command will build the services as defined in the docker-compose.yml file, which is the Express server and the MongoDB database service. For more info about building using Docker see [https://docs.docker.com/v17.12/compose/reference/build/](https://docs.docker.com/v17.12/compose/reference/build/)

### Deploy and Run

To get the database and the express server to run, simply run the command _"docker-compose up"._ The _"docker-compose up" _command aggregates the output of each container. For more info about deploying Docker containers through images see [https://docs.docker.com/compose/reference/up/](https://docs.docker.com/compose/reference/up/) and [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
