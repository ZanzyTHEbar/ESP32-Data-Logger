# ESP32-Data-Logger

This is an app for viewing realtime data on your PC from embedded systems

Currently the app only supports `REST API` endpoints using `GET` requests.

## Installation

Download the latest release for your OS from the [releases page](https://github.com/ZanzyTHEbar/ESP32-Data-Logger/releases)

## To-Do

- [x] export as CSV
- [x] Save chart instances to browser local storage so that they load on page refresh
- [x] Pie Chart support
- [-] multiple datasets on one graph
- [] WebSocket support
- [] Serial Device support
- [] MQTT support
- [] Publish data to google sheets
- [] usage of API keys in the `HTTP` requests
- [] `POST` requests

## Look and Feel

![homescreen](/images/homescreen.png "homescreen")

![settings](/images/settings.png "settings")

![charts](/images/charts.png "charts")

## How to Setup Dev Environment

This project uses NodeJS (v18+) and pnpm. You must install them before continuing.

Next, install the dependencies, navigate to the project directory (`app`) and run:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm tauri dev
```

Finally, the project will open as an app on your device.

You can also run the project in the browser by running:

```bash
pnpm dev
```

To see a list of all available commands, navigate to the `package.json` file and look at the `scripts` section.

## Contributing

Contributions are welcome!

> **Note**: Please use the `pnpm format` command before committing any changes to the project. Please fix any errors that are reported by the linter.

## How to Build

To build the project, run:

```bash
pnpm tauri build
```

This will create a folder called `target` in the `src-tauri` directory. Inside this folder, you will find the executable for your operating system, as well as an installer.

To build the project as a webapp, run:

```bash
pnpm build
```

This will create a folder called `dist` where the static files for the site will live. This webapp can then be hosted on any machine.
