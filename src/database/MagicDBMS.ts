import { MagicDatabaseInfo, DBMSMicrosoftSQLServer, DBMSOracle, DBMS, DBMSQuery } from '.';
import { MagicIni } from '..';

export abstract class MagicDBMS implements DBMS {
  abstract connect(callback: (err?: any) => void);
  abstract query(sql: string | DBMSQuery, args: Array<any>, callback: (err?: any, rec?: any, size?: number) => any);

  public constructor(public magicDatabaseInfo: MagicDatabaseInfo) {}

  public static getInstance(data: any, databaseName?: string) {
    let info: any;

    if (databaseName !== undefined && data instanceof MagicIni) {
      info = new MagicDatabaseInfo(data, databaseName);
    } else {
      info = data;
    }

    if (info instanceof MagicDatabaseInfo) {
      if (info.dataSourceType === 'DBMS') {
        switch (info.dbmsType) {
          case 0:
            return null; //XML
          case 1:
            return null; //Btrieve
          case 2:
            return null; //Pervasive
          case 3:
            return null; //
          case 4:
            return null; //MySQL
          case 5:
            return null; //
          case 6:
            return null; //
          case 7:
            return null; //DB2/400
          case 8:
            return null; //
          case 9:
            return null; //
          case 10:
            return null; //SQLite
          case 11:
            return null; //Local
          case 12:
            return null; //
          case 13:
            return null; //
          case 14:
            return new DBMSOracle(info); //Oracle
          case 15:
            return null; //
          case 16:
            return null; //
          case 17:
            return null; //AS400
          case 18:
            return null; //
          case 19:
            return null; //DB2
          case 20:
            return null; //ODBC
          case 21:
            return new DBMSMicrosoftSQLServer(info); //MicrosoftSQLServer
          case 22:
            return null; //Memory Tables
          default:
            return null;
        }
      }
    }
  }
}
