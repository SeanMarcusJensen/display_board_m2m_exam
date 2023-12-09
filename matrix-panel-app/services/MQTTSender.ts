import { SignboardConfig } from "../types/MatrixConfig";
import Paho from "paho-mqtt";

export default class MQTTSender {
    private client: Paho.Client;
    private options: Paho.ConnectionOptions;

    constructor(private matrix: SignboardConfig) {
        this.client = new Paho.Client(
            `${matrix.brokerScheme}${matrix.brokerUrl}:${matrix.brokerPort}/mqtt`,
            "client"
        );

        this.options = {
            onSuccess: () => {console.log("Connected")},
            onFailure: (e) => {console.log(`Failed to connect: ${e}`)},
        }
    }

    public Connect() {
        this.client.connect(
            {...this.options,
            useSSL: true,
            userName: 'jensen',
            password: 'testpassword',
        });
    }

    public IsConnected() {
        const connected = this.client.isConnected();
        console.log(`Client is ${connected ? "" : "not "} connected`);
        return connected;
    }

    public SendText(text: string, topic: string) {
        console.log("SENDING TEXT");
        console.log(text);
        const message = new Paho.Message(JSON.stringify(text));
        message.destinationName = 'matrix/' + this.matrix.name + "/" + topic;
        console.log(message);
        this.client.send(message);
    }
}