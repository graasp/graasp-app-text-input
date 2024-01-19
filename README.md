<p align="center">
  <a href="https://graasp.eu/">
    <img alt="Graasp" src="https://avatars3.githubusercontent.com/u/43075056" width="300">
  </a>
</p>

<h1 align="center">Graasp App: Text Input</h1>

<p align="center">
  <a href="https://conventionalcommits.org">
    <img
      alt="Conventional Commits"
      src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg"
    >
  </a>
  <a href="https://gitlocalize.com/repo/9182?utm_source=badge"> <img src="https://gitlocalize.com/repo/9182/whole_project/badge.svg" /> </a>
</p>

<p align="center">
  <img
    alt="Screenshot"
    src="https://raw.githubusercontent.com/graasp/graasp-app-text-input/master/docs/assets/screenshot.png"
    width="600"
  >
</p>

## Getting Started

To run this app locally you need to have [Node](https://nodejs.org) and
[NPM](https://www.npmjs.com) installed in your operating system. We strongly recommend that you
also have [Yarn](https://yarnpkg.com/). All the commands that you will see here use `yarn`,
but they have an `npm` equivalent.

Download or clone the repository to your local machine, preferably using [Git](https://git-scm.com).

### Installation

Inside the project directory, run `yarn` to install the project dependencies.

You will also need to create a file called `.env.development` with the following contents.

```sh
VITE_GRAASP_APP_KEY=<app-key>
VITE_ENABLE_MOCK_API=true
VITE_API_HOST=http://localhost:3000
VITE_PORT=3004
VITE_VERSION=local
```

**⚠️Warning ⚠️**: Make sure to set `VITE_ENABLE_MOCK_API=false` when you build for use in the real-world (prod or dev).

### Running Locally

Navigate to the cloned or forked project directory using the command line, type `yarn start` or `yarn dev`.
The app will automatically run on [`http://localhost:3004`](http://localhost:3004). Any changes you make should be automatically rendered in the browser.

To develop without running our backend and frontend you have to put `VITE_ENABLE_MOCK_API=true` in the `.env` file used when running your project (we assume `.env.development` here). This **mocks the API** which simulates a backend and provides your app with a context.

#### Set your app's context

Find detailed instructions on how to use the **mock API** in the [graasp-apps-query-client README](https://github.com/graasp/graasp-apps-query-client/blob/main/README.md).
