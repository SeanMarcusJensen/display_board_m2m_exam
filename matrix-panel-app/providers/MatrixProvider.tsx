import React, { useEffect } from "react";
import MQTTSender from "../services/MQTTSender";
import { MatrixConfig, SignboardConfig } from "../types/MatrixConfig";
import { GetConfigAsync, StoreConfigAsync } from "../services/SignboardRepository";
import { Text } from "../components/Themed";
import { ValidateSignboardConfig } from "../services/Validators/SignboardValidator";

interface MatrixTabsProps {
    matrix: SignboardConfig;
    client: MQTTSender | undefined;
    SetConfig: <T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) => void;
    SaveAsync: () => Promise<boolean>;
}

interface MatrixProviderProps {
    name: string;
    children: React.ReactNode;
}

export const MatrixContext = React.createContext<MatrixTabsProps | undefined>(undefined);

export const MatrixProvider: React.FC<MatrixProviderProps> = ({ name, children }) => {
    const [matrix, setMatrixConfig] = React.useState<SignboardConfig>({} as SignboardConfig);
    const [client, setClient] = React.useState<MQTTSender | undefined>(undefined);
    const [isLoading, setLoading] = React.useState(true);

    function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
        setMatrixConfig(prev => ({...prev, [key]: value}));
    }

    async function SaveAsync() {
        if (ValidateSignboardConfig(matrix)){
            console.log("Config is valid")
            console.log(matrix);
            await StoreConfigAsync(matrix, (e) => { console.log(e) });
            return true;
        } else {
            console.log("Config is invalid")
            return false;
        }
    }
    
    useEffect(() => {
        (async () => {
            if (name == undefined) return;

            console.log("Fetching matrices");
            const value = await GetConfigAsync(name as string, (e) => console.error(e));

            if (value == null || value == undefined) {
                console.log("Matrix not found");
                return;
            }
            setMatrixConfig(value);

            console.log("Creating client");
            const newClient = new MQTTSender(value);
            newClient.Connect();

            setClient(newClient);
        })()
        .then(() => console.log("Done"))
        .finally(() => setLoading(false));
    }, [name]);

    if (isLoading) return (<Text>Loading...</Text>);
    return (
        <MatrixContext.Provider value={{ matrix, client, SetConfig, SaveAsync }}>
            {children}
        </MatrixContext.Provider>
    );
}