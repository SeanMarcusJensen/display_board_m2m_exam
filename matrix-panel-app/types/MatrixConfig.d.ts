export interface SignboardConfig extends MatrixConfig, BrokerConfig {
}

export interface MatrixConfig {
  name: string;
  height: number;
  width: number;
}

export interface BrokerConfig {
  brokerScheme: string;
  brokerUrl: string;
  brokerPort: number;
}
