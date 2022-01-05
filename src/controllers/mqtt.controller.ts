/**
 * gp-mqtt-client | Simple MQTT Client
 *
 * @author Greg PFISTER
 * @since 0.1.0
 * @license MIT
 * @copyright (C) 2021, Greg PFISTER. MIT License
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import EventEmitter from 'events';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import * as log4js from 'log4js';
import { connect as mqttConnect, MqttClient } from 'mqtt';
import { v4 as uuid } from 'uuid';

import { GPPublishOptions, GPSubscribeOptions, GPTopic } from '../models';

/**
 * MQTT Controller
 */
export class GPMqttController extends EventEmitter {
  private _logger: log4js.Logger;
  private _client?: MqttClient;
  private _hostname: string;
  private _port: number;
  private _protocol: string;
  private _deviceId: string;
  private _autoConnect: boolean;

  private _topic?: GPTopic;

  /**
   * Build a MQTT Controller that will connect to an MQTT server via TCP
   * @param hostname The hostname
   * @param port The port number
   * @param protocol The protocol (e.g. mqtt). Only mqtt supported for the time been
   * @param autoConnect Specifies if the client will autoconnect after been disconnected
   * @param verbose Output info message
   * @param debug Output debug message
   */
  constructor(
    hostname: string,
    port: number,
    protocol: string,
    autoConnect: boolean,
    verbose: boolean = false,
    debug: boolean = false
  ) {
    super();

    this._hostname = hostname;
    this._port = port;
    this._protocol = protocol;
    this._deviceId = uuid().toString();
    this._autoConnect = autoConnect;

    // Configure the logger
    const logLevel = debug ? 'debug' : (verbose ? 'info' : 'warn');
    log4js.configure({
      appenders: { client: { type: 'console' } },
      categories: { default: { appenders: ['client'], level: logLevel } }
    });
    this._logger = log4js.getLogger('client');
  }

  /**
   * Connect to the MQTT server
   */
  connect() {
    const mqttClientId = `${this._deviceId}`;
    this._logger.debug(`[MQTT Controller] Connecting to ${this._hostname}:${this._port} with client id ${mqttClientId}`);

    // Create a client, and connect to the Google MQTT bridge.
    this._client = mqttConnect({
      host: this._hostname,
      port: this._port,
      protocol: this._protocol,
      keepalive: 10,
      clientId: this._deviceId,
      protocolId: 'MQTT',
      protocolVersion: 5,
      clean: true,
      reconnectPeriod: 20000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false
    });

    // On successful connection
    this._client.on('connect', (packet) => {
      this._logger.info(`[MQTT Controller] Connected to ${this._hostname}:${this._port} with client id ${mqttClientId}`);
      this.emit('connected');

      // // Attach all boundDevices
      // this._topics.forEach((topic) => {
      //   if (this._client) {
      //     this._client.subscribe(topic.name, { qos: topic.qos });
      //     this._logger.info(`[MQTT Controller] Subscribed to ${topic.name}`);
      //   }
      // });
    });

    // On errors
    this._client.on('error', (error) => {
      this._logger.error(`[MQTT Controller] Error ${error.name}: ${error.message}`);
    });

    // On disconnected
    this._client.on('close', () => {
      this._logger.info(`[MQTT Controller] Disconnected from ${this._hostname}:${this._port}`);

      if (this._client) {
        this._client.end();
      }

      if (this._autoConnect) {
        this._logger.info(`[MQTT Controller] Reconnecting to ${this._hostname}:${this._port} in 1 minute...`);
        setTimeout(() => this.connect(), 60 * 1000);
      }
    });

    // On disconnected
    this._client.on('disconnect', (_) => {
      this._logger.warn(`[MQTT Controller] Disconnected from ${this._hostname}:${this._port}`);

      if (this._autoConnect) {
        this._logger.warn(`[MQTT Controller] Reconnecting to ${this._hostname}:${this._port} in 1 minute...`);
        setTimeout(() => this.connect(), 60 * 1000);
      }
    });
  }

  /**
   * Subscribe to a topic
   * @param topic The topic to subscribe to
   * @param options Options
   */
  subscribe(topic: GPTopic, options: GPSubscribeOptions) {
    if (!this._topic) {
      this._topic = topic;
      if (this._client && this._client.connected) {
        // Handle incomming messages
        this._client.on('message', async (topic, message) => {
          this._logger.info(`[MQTT Controller] Message received on topic ${topic}`);
          if (options.useBase64Decoding) { this._logger.debug('[MQTT Controller] Apply base64 decoding'); }
          const decodedMessage: string = options.useBase64Decoding ? Buffer.from(message.toString(), 'base64').toString('binary') : message.toString();
          if (options.outputPrettyJson) { this._logger.debug('[MQTT Controller] Apply JSON pretty print'); }
          const output: string = options.outputPrettyJson ? JSON.stringify(JSON.parse(decodedMessage), null, 2) : decodedMessage;

          if (options.outputFolder) {
            const folder = `${options.outputFolder}${topic}`;
            if (!existsSync(folder)) {
              try {
                await mkdir(folder, { recursive: true });
              } catch (error) {
                this._logger.error(`[MQTT Controller] Unable to create folder ${folder}: ${error}`);
              }
            }
            const now = new Date();
            let file = `${folder}/${now.toISOString()}`;
            if (options.outputPrettyJson) { file = `${file}.json`; }
            this._logger.info(`[MQTT Controller] Message written to file ${file}`);
            try {
              await writeFile(file, output);

              this._logger.info(`[MQTT Controller] Message written to file ${file}`);
            } catch (error) {
              this._logger.error(`[MQTT Controller] Unable to write message to file ${file}: ${error}`);
            }
          } else {
            console.log(output);
          }

          if (!options.listen) { process.exit(0); }

          // const decodedMessage = JSON.parse(Buffer.from(message.toString(), 'base64').toString('binary'));
          // this._logger.info(`[MQTT Controller] message received on topic ${topic}`);
          // let i = 0;
          // while (i < message.toString().length) {
          //   const r = message.toString().length - i;
          //   if (r > 80) {
          //     console.log(`  ${message.toString().substring(i, i + 80)}`);
          //     i += 80;
          //   } else {
          //     console.log(`  ${message.toString().substring(i, message.toString().length)}`);
          //     i = message.toString().length;
          //   }
          // }
          // // console.log(`${message}`);
          // this._logger.info('[MQTT Controller] Message decoded:');
          // console.log(`${JSON.stringify(decodedMessage, null, 2)}`);
        });

        this._client.on('packetreceive', (packet) => {
          if (packet.cmd === 'suback') {
            this._logger.info(`[MQTT Controller] Subscribed to topic ${topic.name}`);
          }
        });

        // Subscribe to topic
        this._logger.debug(`[MQTT Controller] Subscribing to topic ${topic.name}`);
        this._client.subscribe(topic.name, { qos: topic.qos });
        if (!options.listen) {
          setTimeout(() => {
            this._logger.info('[MQTT Controller] Timeout (1s)');
            process.exit(0);
          }, 1000);
        }
      }
    }
  }

  /**
   * Subscribe to a topic
   * @param topic The topic to publish to
   * @param message The message to publish
   * @param options Options
   */
  publish(topic: GPTopic, message: string, options: GPPublishOptions) {
    if (!this._topic) {
      this._topic = topic;
      if (this._client && this._client.connected) {
        this._client.on('packetreceive', (packet) => {
          if (packet.cmd === 'puback' && this._client) {
            this._logger.info(`[MQTT Controller] Message published to topic ${topic.name}`);
            this._client.end();
          }
        });
        this._logger.debug(`[MQTT Controller] Publishing to topic ${topic.name}`);
        this._client.publish(topic.name, message, { qos: topic.qos, retain: options.retain });
      }
    }
  }

  // /**
  //  * Subscribe to a topic
  //  *
  //  * @param {GPTopic} topic The topic to subscribe too
  //  */
  // unsubscribeTopic(topic: GPTopic) {
  //   if (this._topics.findIndex((aTopic) => topic.name === aTopic.name) > 0) {
  //     this._topics = [...this._topics.filter((aTopic) => topic.name === aTopic.name)];
  //     if (this._client && this._client.connected) {
  //       this._client.unsubscribe(topic.name);
  //       this._logger.info(`[MQTT Controller] Unsubscribed from ${topic.name}`);
  //     }
  //   }
  // }
}
