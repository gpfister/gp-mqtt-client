[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-16.x-233056)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-ready-cb3837)](https://www.npmjs.com/package/gp-mqtt-client)

# gp-mqtt-client

A simple console base MQTT client for development purpose.

## About

This simple console base MQTT client is for my personal development requirement.
It allows me to:

- subscribe to a topic and listen for messages or just get the last one (if any)
- publish a message to a topic

It doesn't support authentication.

## Install

The easiest way is to install via npm:

```
sudo npm i -g gp-mqtt-client
```

Alternatively, you can clone, build and install:

```
git clone https://github.com/gpfister/gp-mqtt-client.git
cd gp-mqtt-client
npm ci
sudo npm -g install $(npm pack . | tail -1)
```

## Usage

It uses `yargs` with a command approach:

```
$ ./bin/gp-mqtt-client --help
gp-mqtt-client [command]

Commands:
  gp-mqtt-client sub [topic] [options]      Subscribe to a topic
  gp-mqtt-client pub [topic] [message]      Publish a message to a topic
  [options]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --hostname  The hostname of the MQTT server[string] [default: "localhost"]
  -p, --port      The port of the MQTT server           [number] [default: 1883]
  -P, --protocol  The protocol to use to connect to the MQTT server
                                                      [string] [default: "mqtt"]
  -v, --verbose                                       [boolean] [default: false]
  -d, --debug                                         [boolean] [default: false]

For more detail, visit https://github.com/gpfister/gp-mqtt-client

This is a free software (MIT License), enjoy !
```

### `sub` command

This command allow to subscribe to a topic. If the `--listen` option is used, it
will listen to incomming message, reconnecting if needed.

Messages can be decoded using base64 (option `--base64`).

```
$ ./bin/gp-mqtt-client sub --help
gp-mqtt-client sub [topic] [options]

Subscribe to a topic

Positionals:
  topic  The topic to subscribe to                                      [string]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --hostname  The hostname of the MQTT server[string] [default: "localhost"]
  -p, --port      The port of the MQTT server           [number] [default: 1883]
  -P, --protocol  The protocol to use to connect to the MQTT server
                                                      [string] [default: "mqtt"]
  -v, --verbose                                       [boolean] [default: false]
  -d, --debug                                         [boolean] [default: false]
  -q, --qos       QoS (Quality Of Service) of the topic    [number] [default: 0]
  -b, --base64    Apply base64 decoding               [boolean] [default: false]
  -j, --json      Output as pretty json               [boolean] [default: false]
  -o, --output    Output each message as file to a folder               [string]
  -l, --listen    Listen for new message              [boolean] [default: false]
```

### `pub` command

This command allow to publish a message to a topic.

```
$ ./bin/gp-mqtt-client pub --help
gp-mqtt-client pub [topic] [message] [options]

Publish a message to a topic

Positionals:
  topic    The topic to publish to                                      [string]
  message  The message to publish                                       [string]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --hostname  The hostname of the MQTT server[string] [default: "localhost"]
  -p, --port      The port of the MQTT server           [number] [default: 1883]
  -P, --protocol  The protocol to use to connect to the MQTT server
                                                      [string] [default: "mqtt"]
  -v, --verbose                                       [boolean] [default: false]
  -d, --debug                                         [boolean] [default: false]
  -q, --qos       QoS (Quality Of Service) of the topic    [number] [default: 0]
  -r, --retain    Add retain flag to message          [boolean] [default: false]
```

## Build

### Requirements

This project has been built using

- [Ubuntu 20.04](https://ubuntu.com)
- [Node.js v16](https://nodejs.org)
- NPM v8
- Mosquitto MQTT Server
- libmosquitto and libmosquitto-dev

To install dependencies on Ubuntu 20.04:

```
apt install -y mosquitto libmosquitto libmosquitto-dev
```

### Build

To build, first get all dependencies:

```
npm ci
```

Then, build the source code:

```
npm run build
```

When successfully built, simply run `npm run help` or `./bin/gp-mqtt-client --help`.

### Unit test

To run the test script:

```
npm test
```

## Examples

The following example is used in the context of IoT devices interface to
[Google Cloud Platform](https://cloud.google.com) via
[Cloud IoT Core](https://cloud.google.com/iot-core), emulated via a local
Mosquitto MQTT Server, and [Firebase](https://firebase.google.com) emulated via
the provided
[emulators](https://firebase.google.com/docs/emulator-suite?authuser=0). A
[Mosquitto](<[https://ec](https://mosquitto.org)>) server (without
authentication) is used.

To monitor device config (QoS = 1):

```
gp-mqtt-client sub "/devices/<DEVICE_ID>/config" -q 1 -l
```

The following example publishes a message to a topic on a
[Mosquitto](<[https://ec](https://mosquitto.org)>) server (without
authentication):

```
gp-mqtt-client pub "/devices/<DEVICE_ID>/config" "{\"hello\": \"world !\"}" -q 1
```

## Contributions

See instructions [here](./CONTRIBUTING.md).

## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

See license [here](./LICENSE).
