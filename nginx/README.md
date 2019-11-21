## Web server and reverse proxy


### Prerequisites

The back-end application is powered by Docker + docker-compose which requires the Docker daemon to be installed. Instructions for how to do this can be found in the README of the back-end application.


### Build

In order to build the Docker image for the front-end web application it is necessary to pull down the GitHub repository. The first step is to build the web application, and this is performed by entering the "webapp" directory, installing all 3rd party dependencies by executing _"npm install"_, and after the dependencies are installed you can build/bundle the web application using Webpack by running "_npm build_". After the web application is built you can find the output files in the "webapp/build" directory.

Inside of the "nginx" folder there are multiple configuration files that need to set up correctly in order for the reverse-proxy and web server functionality to work as intended before you proceed to build the container.

Inside of the "nginx/settings" folder you can find the "html", "conf.d" and "cert" folder, respectively. The first step is to copy the built public-facing React bundle over from the "webapp/build" directory and into the "nginx/settings/html" directory of the web server. 

After this is done you need to setup the correct IP/domain of the REST API in the proxy\_pass field of the reverse-proxy configuration, which is located inside of the https.conf file in the "conf.d" directory and found inside of the location directive of the 2nd server block.

The last step is to provide a valid private encryption key in the "cert" directory, which needs to be obtained from a certification authority. The private key should be put in "privkey.pem" and the certificate chain in "fullchain.pem". Since there are various different methods to obtain a valid certificate it will not be explained here, but in the spirit of open-source we recommend using the free and open Let's Encrypt authority [https://letsencrypt.org/](https://letsencrypt.org/) Given that the build prerequisites are realized you may proceed to build the web server container. Building is performed by navigating to the root "nginx" directory and executing "docker-compose build" to build the container, which will automatically seed the configuration files into the official NGINX Docker container.


### Deploy and Run

Given that the image has been built it can be deployed, and assuming you want to deploy on the same environment you have built the container you may execute _"docker-compose up" _to start the web service.
