import { DBMSQuery } from '.';
export interface DBMS {
    connect(callback: (err?: any) => void): any;
    query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any): any;
}
//# sourceMappingURL=DBMS.d.ts.map