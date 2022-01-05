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

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { QoS } from 'mqtt';

import { GPMqttController } from './controllers';

/**
 * Simple MQTT Client main application class
 */
export class GPApp {
  /**
   * Main loop
   */
  main() {
    // const version = require('../package.json').version;
    // eslint-disable-next-line chai-friendly/no-unused-expressions
    yargs(hideBin(process.argv))
      .command('sub [topic] [options]', 'Subscribe to a topic', (yargs) => {
        return yargs
          .positional('topic', { description: 'The topic to subscribe to', type: 'string' })
          .option('qos', { alias: 'q', type: 'number', description: 'QoS (Quality Of Service) of the topic', default: 0 })
          .option('base64', { alias: 'b', type: 'boolean', description: 'Apply base64 decoding', default: false })
          .option('json', { alias: 'j', type: 'boolean', description: 'Output as pretty json', default: false })
          .option('output', { alias: 'o', type: 'string', description: 'Output each message as file to a folder' })
          .option('listen', { alias: 'l', type: 'boolean', description: 'Listen for new message', default: false });
      }, (argv) => {
        const hostname = argv.hostname as string;
        const port = argv.port as number;
        const protocol = argv.protocol as string;
        const topic = argv.topic as string;
        const qos = argv.qos as number;
        const useBase64Decoding = argv.base64 as boolean;
        const outputPrettyJson = argv.json as boolean;
        const debug = argv.debug as boolean;
        const verbose = argv.verbose as boolean;
        const outputFolder = argv.output as string | undefined;
        const listen = argv.listen as boolean;

        if (topic && topic.length === 0) {
          yargs.fail(() => { });
        }

        const mqttController = new GPMqttController(hostname, port, protocol, true, verbose, debug);
        mqttController.on('connected', async () => {
          mqttController.subscribe({ name: topic, qos: qos as QoS }, { listen: listen, useBase64Decoding: useBase64Decoding, outputPrettyJson: outputPrettyJson, outputFolder: outputFolder });
        });
        mqttController.connect();
      })
      .command('pub [topic] [message] [options]', 'Publish a message to a topic', (yargs) => {
        return yargs
          .positional('topic', { description: 'The topic to publish to', type: 'string' })
          .positional('message', { description: 'The message to publish', type: 'string' })
          .option('qos', { alias: 'q', type: 'number', description: 'QoS (Quality Of Service) of the topic', default: 0 })
          .option('retain', { alias: 'r', type: 'boolean', description: 'Add retain flag to message', default: false });
      }, (argv) => {
        const hostname = argv.hostname as string;
        const port = argv.port as number;
        const protocol = argv.protocol as string;
        const topic = argv.topic as string;
        const message = argv.message as string;
        const qos = argv.qos as number;
        const debug = argv.debug as boolean;
        const verbose = argv.verbose as boolean;
        const retain = argv.retain as boolean;

        if (!topic || topic.length === 0 || message || message.length === 0) {
          yargs.fail(() => { });
        }

        const mqttController = new GPMqttController(hostname, port, protocol, false, verbose, debug);
        mqttController.on('connected', async () => {
          mqttController.publish({ name: topic, qos: qos as QoS }, message, { retain: retain });
        });
        mqttController.connect();
      })
      .option('hostname', { alias: 'h', type: 'string', description: 'The hostname of the MQTT server', default: 'localhost' })
      .option('port', { alias: 'p', type: 'number', description: 'The port of the MQTT server', default: 1883 })
      .option('protocol', { alias: 'P', type: 'string', description: 'The protocol to use to connect to the MQTT server', default: 'mqtt' })
      .option('verbose', { alias: 'v', type: 'boolean', descritpion: 'Additional info output', default: false })
      .option('debug', { alias: 'd', type: 'boolean', descritpion: 'Full debug output (superseeds verbose)', default: false })
      .strict()
      .epilog('For more detail, visit https://github.com/gpfister/gp-mqtt-client\n\nThis is a free software (MIT License), enjoy !')
      .showHelpOnFail(true)
      .argv;
  }
}
