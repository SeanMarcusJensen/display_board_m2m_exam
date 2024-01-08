import { SignboardConfig } from "../types/MatrixConfig";
import Paho, { TypedArray } from "paho-mqtt";

export default class MQTTSender {
    private client: Paho.Client;
    private options: Paho.ConnectionOptions;

    constructor(private matrix: SignboardConfig) {
        this.client = new Paho.Client(
            `${matrix.brokerScheme}${matrix.brokerUrl}:${matrix.brokerPort}/mqtt`,
            "client_id" + Math.random().toString(16)
        );

        this.options = {
            onSuccess: () => {console.log("Connected")},
            onFailure: (e) => {
                console.log(`Failed to connect to ${matrix.brokerScheme}${matrix.brokerUrl}:${matrix.brokerPort}/mqtt`);
                console.error(e);
            },
            userName: matrix.brokerUsername,
            password: matrix.brokerPassword,
            useSSL: true,
        }
    }

    public Connect() {
        this.client.connect(this.options);
    }

    public IsConnected() {
        const connected = this.client.isConnected();
        console.log(`Client is ${connected ? "" : "not "} connected`);
        return connected;
    }

    // TODO: Sends text to the matrix as JSON
    public SendAsJson<T>(object: T, topic: string) {
        console.log("SENDING TEXT");
        console.log(object);
        const message = new Paho.Message(JSON.stringify(object));
        message.destinationName = this.matrix.name + "/" + topic;
        console.log(message);
        this.client.send(message);
    }

    // TODO: SendImage sends an image to the matrix Uint16Array
    public SendImage(image: number[], topic: string) {
        console.log("SENDING IMAGE");
        console.log(image);

        const payload = {
            payload: image,
        }

        const message = new Paho.Message(JSON.stringify(payload));
        message.destinationName = this.matrix.name + "/" + topic;

        console.log(message);
        this.client.send(message);
    }
}