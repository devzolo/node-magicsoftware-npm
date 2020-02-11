interface MagicIniData extends WeakMap<{}, Record<string, string>> {
    MAGIC_ENV: Record<string, string>;
    MAGIC_SERVERS: Record<string, string>;
    MAGIC_COMMS: Record<string, string>;
    MAGIC_DBMS: Record<string, string>;
    MAGIC_DATABASES: Record<string, string>;
    MAGIC_LOGICAL_NAMES: Record<string, string>;
    MAGIC_PRINTERS: Record<string, string>;
    MAGIC_LANGUAGE: Record<string, string>;
    MAGIC_SERVICES: Record<string, string>;
    MAGIC_GATEWAYS: Record<string, string>;
    MAGIC_JAVA: Record<string, string>;
    MAGIC_LOGGING: Record<string, string>;
    CRR_INTERFACES: Record<string, string>;
    TOOLS_MENU: Record<string, string>;
    MAGIC_BUILDERS: Record<string, string>;
    MAGIC_DEFAULTS: Record<string, string>;
    MAGIC_SPECIALS: Record<string, string>;
    MAGIC_SYSTEMS: Record<string, string>;
    translate(str: string): string;
}
export declare class MagicIni {
    iniFilePath: string;
    ini: MagicIniData;
    constructor(iniFilePath: string);
    private static EOL;
    private isQuoted;
    private safe;
    private unsafe;
    private dotSplit;
    private encode;
    private decode;
    private decodeAdd;
    /**
     * Translates all logical names, including nested logical names, in a string to their actual values.
     * If a logical name is not found, it will be removed from the returned string. Secret names are not translated.
     * @method translate
     * @param str str – An alpha value with logical names.
     * @returns The actual values represented by logical names and nested logical names.
     */
    translate(str: string): string;
    add(iniFilePath: string): void;
    get(section: string, key: string): string | null;
}
export {};
//# sourceMappingURL=index.d.ts.map