import { MagicDBMS, MagicDatabaseInfo, DBMSQuery } from '.';
export declare class DBMSOracle extends MagicDBMS {
    private connection;
    private oracledb;
    private pool;
    private db;
    constructor(magicDatabaseInfo: MagicDatabaseInfo);
    connect(callback: (err?: any) => void): Promise<void>;
    query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rs?: any) => any): Promise<unknown>;
}
//# sourceMappingURL=DBMSOracle.d.ts.map