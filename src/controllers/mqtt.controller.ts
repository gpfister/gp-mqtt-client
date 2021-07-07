/**
 * Simple MQTT Client
 *
 * @author Greg PFISTER
 * @since 0.1.0
 * @license MIT
 * @copyright (C) 2021, Greg PFISTER. MIT License
 */

import {Logger} from 'log4js';
import {connect as mqttConnect, MqttClient} from 'mqtt';
import {v4 as uuid} from 'uuid';

import {SMCTopic} from '../models/topic.model';

/**
 *
 */
export class SMCMqttController {
  private _logger: Logger;
  private _client?: MqttClient;
  private _hostname: string;
  private _port: number;
  private _protocol: string;
  private _deviceId: string;
  private _autoConnect: boolean;

  private _topics: SMCTopic[] = [];

  /**
   *  Build a MQTT Controller that will connect to an MQTT server via TCP
   *
   * @param {string} hostname The hostname
   * @param {number} port The port number
   * @param {string} protocol The protocol (e.g. mqtt). Only mqtt supported for the time been
   * @param {boolean} autoConnect Specifies if the client will autoconnect after been disconnected
   * @param {Logger} logger The logger for any outputs
   */
  constructor(hostname: string, port: number, protocol: string, autoConnect: boolean, logger: Logger) {
    this._hostname = hostname;
    this._port = port;
    this._protocol = protocol;
    this._deviceId = uuid().toString();
    this._autoConnect = autoConnect;
    this._logger = logger;
  }

  /**
   * Get the list of topics this contoller is/will be subscribed to
   *
   * @return {SMCTopic[]} The topic list
   */
  getTopics(): SMCTopic[] {
    return [...this._topics];
  }

  /**
   * Connect to the MQTT server
   */
  connect() {
    const mqttClientId = `${this._deviceId}`;
    this._logger.debug(`Connecting to ${this._hostname}:${this._port} with client id ${mqttClientId}`);

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
      rejectUnauthorized: false,
    });

    // On successful connection
    this._client.on('connect', (packet) => {
      this._logger.info(`MQTT Controller: Connected to ${this._hostname}:${this._port} with client id ${mqttClientId}`);

      // Attach all boundDevices
      this._topics.forEach((topic) => {
        if (this._client) {
          this._client.subscribe(topic.name, {qos: topic.qos});
          this._logger.info(`MQTT Controller: Subscribed to ${topic.name}`);
        }
      });
    });

    // On errors
    this._client.on('error', (error) => {
      this._logger.error(`MQTT Controller: Error ${error.name}: ${error.message}`);
    });

    // On disconnected
    this._client.on('close', () => {
      this._logger.warn(`MQTT Controller: Disconnected from ${this._hostname}:${this._port}`);

      if (this._client) {
        this._client.end();
      }

      if (this._autoConnect) {
        this._logger.warn(`MQTT Controller: Reconnecting to ${this._hostname}:${this._port} in 1 minute...`);
        setTimeout(() => this.connect(), 60 * 1000);
      }
    });

    // On disconnected
    this._client.on('disconnect', (_) => {
      this._logger.warn(`MQTT Controller: Disconnected from ${this._hostname}:${this._port}`);

      if (this._autoConnect) {
        this._logger.warn(`MQTT Controller: Reconnecting to ${this._hostname}:${this._port} in 1 minute...`);
        setTimeout(() => this.connect(), 60 * 1000);
      }
    });

    // Handle incomming messages
    this._client.on('message', (topic, message) => {
      const decodedMessage = JSON.parse(Buffer.from(message.toString(), 'base64').toString('binary'));
      this._logger.info(`MQTT Controller: message received on topic ${topic}`);
      this._logger.info(`MQTT Controller: Message received:`);
      console.log(`${ message }`);
      this._logger.info(`MQTT Controller: Message decoded`);
      console.log(`${ JSON.stringify(decodedMessage) }`);
    });
  }

  /**
   * Subscribe to a topic
   *
   * @param {SMCTopic} topic The topic to subscribe too
   */
  subscribeTopic(topic: SMCTopic) {
    if (this._topics.findIndex((aTopic) => {
      topic.name === aTopic.name;
    }) < 0) {
      this._topics = [...this._topics, topic];
      if (this._client && this._client.connected) {
        this._client.subscribe(topic.name, {qos: topic.qos});
        this._logger.info(`MQTT Controller: Subscribed to ${topic.name}`);
      }
    }
  }

  /**
   * Subscribe to a topic
   *
   * @param {SMCTopic} topic The topic to subscribe too
   */
  unsubscribeTopic(topic: SMCTopic) {
    if (this._topics.findIndex((aTopic) => {
      topic.name === aTopic.name;
    }) > 0) {
      this._topics = [...this._topics.filter((aTopic) => {
        topic.name === aTopic.name;
      })];
      if (this._client && this._client.connected) {
        this._client.unsubscribe(topic.name);
        this._logger.info(`MQTT Controller: Unsubscribed from ${topic.name}`);
      }
    }
  }
}
