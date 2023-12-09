import { BrokerConfig, MatrixConfig, SignboardConfig } from "../../types/MatrixConfig";

export function ValidateSignboardConfig(config: SignboardConfig) : boolean {
    return ValidateMatrixConfig(config) && ValidateBrokerConfig(config);
}

export function ValidateMatrixConfig(config: MatrixConfig) : boolean {
    if (isNaN(config.height) || isNaN(config.width)) {
        return false;
    }

    return config.name.length > 0 && config.height > 0 && config.width > 0;
}

export function ValidateBrokerConfig(config: BrokerConfig) : boolean {
    if (config.brokerScheme !== 'http://' && config.brokerScheme !== 'https://') {
        return false;
    }

    if (isNaN(config.brokerPort)) {
        return false
    }

    return config.brokerScheme.length > 0 && config.brokerUrl.length > 0 && config.brokerPort > 0;
}