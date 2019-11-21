# Web Application

The project web application is built on the React UI library. It uses component state, class-based components as well as functional components, and relies on functionality from react-leaflet. For all dependencies you can review the "package.json" file. This project uses Webpack in order to generate a JavaScript bundle. Husky is used to enforce eslint to run as a pre-commit hook with settings in ".huskyrc", using the recommended airbnb linter settings as well as some customizations as found in ".eslintrc.js". This application is a basic prototype for this prosject and should be built from scratch using a state management framework if the project is to be developed further and extended. 

## Prerequisites
This React application needs to point to a valid REST API endpoint, preferably going through a TLS reverse proxy. For this the file "src/utils/urls.js" should be edited to have the baseURL constant pointing to the API URL of your deployment in order to access the data, and otherwise it would not work as intended.

## Install dependencies

### npm install

(Installs all dependencies as listed in package.json)

## Start application

### npm run start

(Starts the application in development mode using the webpack-dev-server)

## Run linter

### npm run lint

(Runs the linter on the code written in this project)

## Build JavaScript bundle using Webpack

### npm run build

(Builds this web application by generating a JavaScript bundle and associated files such as index.html in order to display this application in a production environment)

## Cypress E2E Testing

This project uses the Cypress framework for End to End testing. It is able to test any web application that runs in the browser, and has an open-source test runner based on Chromium. The configuration file for the test framework can be found in "cypress.json" and the tests in "cypress/integration/main". You can also access any completed tests screenshots and video results from the "cypress" folder and the folder "videos" or "screenshots", respectively. It is important to note that these tests are intended to be run during development, and on the development environment of the system, which is why it is pointing towards the localhost:8080 URL instead of a production environment. Some of these tests may break as the DOM is changed due to further development, so tests should be updated to reflect these changes when needed.

### Run the testing framework in GUI mode

The Cypress framework can be started by executing "npm run cypress" in the main folder, provided all dependencies including dev-dependencies are installed.

### Run the testing framework in headless mode

You may run the test runner (browser) in headless mode, exeucting all the tests, taking all the screenshots and videos by running the command "npm run cypress:run"
