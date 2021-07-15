import {QoS} from 'mqtt';

export interface SMCTopic {
  name: string;
  qos: QoS
}
