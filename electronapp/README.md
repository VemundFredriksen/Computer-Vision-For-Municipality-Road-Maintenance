## Electron Desktop Application


### Prerequisites

The electron application runs on Windows, Mac and Linux. To build it you need to have Node.js and npm installed. The electron application has Node.js module dependencies which you install using npm with the command _"npm install"_, the full list of these can be found in package.json.


### Build

After installing the required modules the application can be built by using the commands _"npm build:react"_ and then _"npm run build"_. This Electron application uses the React UI library, which is why the React application needs to be built before the Electron application can be built.


### Deploy and Run

To run the Electron app simply use the command _"npm run start"_.
