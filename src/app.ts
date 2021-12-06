/**
 * Simple MQTT Client
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

import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { QoS } from 'mqtt';

import { GPMqttController } from './controllers';

/**
 * Simple MQTT Client main application class
 */
export class GPApp {
  private _logger: log4js.Logger;

  /**
   * Constructor - Build the app
   */
  constructor() {
    // Load the .env variables
    dotenv.config();

    // Configure the logger
    const logLevel = process.env.GP_LOG_LEVEL ? process.env.GP_LOG_LEVEL : 'info';
    log4js.configure({
      appenders: { client: { type: 'console' } },
      categories: { default: { appenders: ['client'], level: logLevel } }
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
    const version = require('../package.json').version;
    // eslint-disable-next-line no-unused-expressions
    yargs(hideBin(process.argv))
      .command('listen [topic]', 'Listen to a topic', (yargs) => {
        return yargs
          .positional('topic', { description: 'The topic to subscribe to', type: 'string' })
          .option('qos', { alias: 'q', type: 'number', description: 'QoS (Quality Of Service) of the topic', default: 0 })
          .option('push', { alias: 'p', type: 'string', description: 'Push to a Google PubSub topic', default: 'localhost:8085/mqtt' });
      }, (argv) => {
        if (argv.topic && argv.qos && argv.hostname && argv.port && argv.protocol) {
          const hostname = argv.hostname as string;
          const port = argv.port as number;
          const protocol = argv.protocol as string;
          const topic = argv.topic as string;
          const qos = argv.qos as number;

          const mqttController = new GPMqttController(hostname, port, protocol, true, this._logger);
          mqttController.connect();
          mqttController.subscribeTopic({ name: topic, qos: qos as QoS });
        } else {
          yargs.fail(() => { });
        }
      }
      )
      .option('hostname', { alias: 'h', type: 'string', description: 'The hostname of the MQTT server', default: 'localhost' })
      .option('port', { alias: 'p', type: 'number', description: 'The port of the MQTT server', default: 1883 })
      .option('protocol', { alias: 'P', type: 'string', description: 'The protocol to use to connect to the MQTT server', default: 'mqtt' })
      .strict()
      .epilog(`Version: ${version}\n\nFor more detail, visit https://github.com/gpfister/simple-mqtt-client.\n\nThis is a free software (MIT License), enjoy !`)
      .showHelpOnFail(true)
      .argv;
  }
}
