import { MagicIni } from '..';
export declare class MagicDatabaseInfo {
    config: MagicIni;
    key: string;
    private raw;
    dataSourceType: string;
    dbmsType: number;
    database: string;
    server: string;
    userName: string;
    password: string;
    connectString: string;
    private nop;
    private get;
    private getInt;
    constructor(config: MagicIni, key: string);
}
//# sourceMappingURL=MagicDatabaseInfo.d.ts.map