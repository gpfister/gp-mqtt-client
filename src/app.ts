/**
 * Simple MQTT Client
 *
 * @author Greg PFISTER
 * @since 0.1.0
 * @license MIT
 * @copyright (C) 2021, Greg PFISTER. MIT License
 */

import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import { QoS } from 'mqtt';

import {SMCMqttController} from './controllers/mqtt.controller';

/**
 * Simple MQTT Client main application class
 */
export class SMCApp {
  private _logger: log4js.Logger;

  /**
   * Constructor - Build the app
   */
  constructor() {
    // Load the .env variables
    dotenv.config();

    // Configure the logger
    const logLevel = process.env.OSK_LOG_LEVEL ? process.env.OSK_LOG_LEVEL : 'info';
    log4js.configure({
      appenders: {client: {type: 'console'}},
      categories: {default: {appenders: ['client'], level: logLevel}},
    });
    // log4js.configure({
    //   appenders: { http_client: { type: "file", filename: "client.log" } },
    //   categories: { default: { appenders: ["main"], level: logLevel } },
    // });
    this._logger = log4js.getLogger('client');
  }

  /**
   * Main loop
   */
  main() {
    yargs(hideBin(process.argv))
        .command(`listen [topic]`, 'Start listening to topic', (yargs) => {
          return yargs
            .positional('topic', { description: 'The topic to subscribe to', type: 'string' })
            .option('qos', { alias: 'q', type: 'number', description: 'QoS (Quality Of Service) of the topic', default: 0 });
        }, (argv) => {
          if (argv.topic && argv.qos && argv.hostname && argv.port && argv.protocol) {
            const hostname = argv.hostname as string
            const port = argv.port as number
            const protocol = argv.protocol as string
            const topic = argv.topic as string
            const qos = argv.qos as number
            
            const mqttController = new SMCMqttController(hostname, port, protocol, true, this._logger);
            mqttController.connect()
            mqttController.subscribeTopic({ name: topic, qos: qos as QoS })
            
          } else {
            yargs.fail(() => {})
          }
        }
      )
      .option('hostname', {alias: 'h', type: 'string', description: 'The hostname of the MQTT server', default: 'localhost'})
      .option('port', {alias: 'p', type: 'number', description: 'The port of the MQTT server', default: 1883})
      .option('protocol', { alias: 'P', type: 'string', description: 'The protocol to use to connect to the MQTT server', default: 'mqtt' })
      .strict()
      .epilog('For more detail, visit https://github.com/gpfister/simple-mqtt-client.\n\nThis is a free software (MIT License), enjoy !')
      .showHelpOnFail(true)
      .argv;
  }
}
