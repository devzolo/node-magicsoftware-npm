import { MagicDBMS, MagicDatabaseInfo, DBMSQuery } from '.';
export declare class DBMSMicrosoftSQLServer extends MagicDBMS {
    private connection;
    private tedious;
    private db;
    constructor(magicDatabaseInfo: MagicDatabaseInfo);
    connect(callback: (err?: any) => void): Promise<void>;
    query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rs?: any) => any): Promise<unknown>;
}
//# sourceMappingURL=DBMSMicrosoftSQLServer.d.ts.map