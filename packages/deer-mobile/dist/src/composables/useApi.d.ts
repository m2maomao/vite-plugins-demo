export declare function useApi(): {
    [moduleName: string]: {
        [methodName: string]: (...args: any[]) => Promise<any>;
    };
};
