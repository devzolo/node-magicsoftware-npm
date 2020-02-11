import { MagicDatabaseInfo, DBMSMicrosoftSQLServer, DBMSOracle, DBMS, DBMSQuery } from '.';
export declare abstract class MagicDBMS implements DBMS {
    magicDatabaseInfo: MagicDatabaseInfo;
    abstract connect(callback: (err?: any) => void): any;
    abstract query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any): any;
    constructor(magicDatabaseInfo: MagicDatabaseInfo);
    static getInstance(data: any, databaseName?: string): DBMSOracle | DBMSMicrosoftSQLServer | null | undefined;
}
//# sourceMappingURL=MagicDBMS.d.ts.map