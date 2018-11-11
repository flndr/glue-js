export declare type unload = () => void;
export declare function load(url: string | string[]): Promise<unload>;
