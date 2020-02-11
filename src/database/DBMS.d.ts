import { DBMSQuery } from '.';

export interface DBMS {
  connect(callback: (err?: any) => void);
  query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any);
}
