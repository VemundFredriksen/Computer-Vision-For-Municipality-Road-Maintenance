# Web App

The project web application is built on the React UI library. It uses component state, class-based components and relies heavily on functionality from react-leaflet as well as using react-router. For all dependencies you can review the "package.json" file. This project uses Webpack in order to generate a JavaScript bundle. Husky is used to enforce eslint to run as a pre-commit hook with settings in ".huskyrc", using the recommended airbnb linter settings as well as some customizations as found in ".eslintrc.js"

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