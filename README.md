[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# Simple MQTT Client

A simple console base MQTT client for development purpose.

## About

This simple console base MQTT client is for my personal development requirement.
It allows me to:

- monitor topics
- push message to a Google PubSub Firebase emulator

# Usage

It uses `yargs` with a command approach:

```
$ ./dist/simple-mqtt-client --help

simple-mqtt-client [command]

Commands:
  simple-mqtt-client listen [topic]  Start listening to topic

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --hostname  The hostname of the MQTT server[string] [default: "localhost"]
  -p, --port      The port of the MQTT server           [number] [default: 1883]
  -P, --protocol  The protocol to use to connect to the MQTT server
                                                      [string] [default: "mqtt"]
```

### Listen command

```
$ ./dist/simple-mqtt-client listen --help                                                                                                                                                                                 ✔  378  18:15:25
simple-mqtt-client listen [topic]

Start listening to topic

Positionals:
  topic  The topic to subscribe to                                      [string]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --hostname  The hostname of the MQTT server[string] [default: "localhost"]
  -p, --port      The port of the MQTT server           [number] [default: 1883]
  -P, --protocol  The protocol to use to connect to the MQTT server
                                                      [string] [default: "mqtt"]
  -q, --qos       QoS (Quality Of Service) of the topic    [number] [default: 0]
```

## Build

### Requirements

This project has been built using

- [Ubuntu 20.04](https://ubuntu.com)
- [Node.js v14](https://nodejs.org)
- NPM v8
- Mosquitto MQTT Server v4
- libmosquitto v1

### Build

To build, first get all dependencies:

```
npm ci
```

Then, build the source code:

```
npm run build
```

When successfully built, simply run `./dist/simple-mqtt-client --help`.

## Examples

The following example are used in the context of IoT devices interface to
[Google Cloud Platform](https://cloud.google.com) via
[Cloud IoT Core](https://cloud.google.com/iot-core), emulated via a local
Mosquitto MQTT Server, and [Firebase](https://firebase.google.com) emulated via
the provided
[emulators](https://firebase.google.com/docs/emulator-suite?authuser=0).

- Monitor device config (QoS = 1): `simple-mqtt-client listen "/devices/deviceId/config" -q 1`
- Monitor device telemetry (QoS = 1) and push to a PubSub topic: `simple-mqtt-client listen "/devices/deviceId/telemetry" -q 1 -p localhost:16004/telemetry`

## Contributions

See instructions [here](./CONTRIBUTIONS.md).

## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

See license [here](./LICENSE).
