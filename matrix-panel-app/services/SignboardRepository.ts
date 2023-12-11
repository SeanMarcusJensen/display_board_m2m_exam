import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignboardConfig } from '../types/MatrixConfig';

const CONFIG_KEY = 'matrix:';

export const StoreConfigAsync = async (config: SignboardConfig, onError: (e: unknown) => void) : Promise<Boolean> => {
    try {
        console.debug(`[${config.name}] storing ${config}`);
        console.debug(config);
        const jsonValue = JSON.stringify(config);
        console.debug(`Serialized: ${jsonValue}`);
        await AsyncStorage.setItem(CONFIG_KEY + config.name, jsonValue);
        return true;
    } catch (e) {
        onError(e);
        return false;
    }
}

export const GetConfigAsync = async (name: string, onError: (e: unknown) => void, withPrefix: boolean = true) : Promise<SignboardConfig | undefined> => {
    try {
        if (name == null || name.length < 1) return undefined;
        const key = withPrefix ? CONFIG_KEY + name : name;
        const config = await AsyncStorage.getItem(key); 
        console.debug(`[${name}] returned ${config}`);
        return config != null ? JSON.parse(config) as SignboardConfig : undefined;
    } catch (e) {
        onError(e);
        return undefined;
    }
}

export const GetAllKeysAsync = async() : Promise<readonly string[]> => {
    try{
        console.log("Getting keys");
        const keys = await AsyncStorage.getAllKeys();

        if (keys == null || keys.length < 1)
        {
            console.log("No keys");
            return [];
        }

        console.log("Got keys");
        console.log(keys);
        const configs: string[] = [];
        await Promise.all(keys.map(async (key) => {
            if (key != null && key.length > 0 && key.startsWith(CONFIG_KEY)) {
                configs.push(key.substring(CONFIG_KEY.length));
            }
        }));
        console.log("Returning configs");
        console.log(configs);
        return configs;
    } catch(e) {
        return [];
    }
}

export const GetAllAsync = async (onError: (e: unknown) => void) : Promise<SignboardConfig[]> => {
    try {
        const configurations: SignboardConfig[] = [];
        const keys = await AsyncStorage.getAllKeys();
        console.debug(`Keys: ${keys}`);

        await Promise.all(keys.map(async (key) => {
            if (key.startsWith(CONFIG_KEY)) {
                const config = await GetConfigAsync(key, onError, false);
                if (config != null) {
                    console.debug(`[${key}] returned ${config}`);
                    configurations.push(config);
                }
            }
        }));

        console.log(`Returning ${configurations.length} configurations`);
        console.log(configurations);
        return configurations;
    } catch (e) {
        onError(e);
        return [];
    }
}