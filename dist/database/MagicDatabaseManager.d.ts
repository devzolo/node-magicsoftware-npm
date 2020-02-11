import { MagicIni } from '..';
import { MagicDBMS } from '.';
export declare class MagicDatabaseManager {
    private config;
    [index: number]: MagicDBMS;
    private databases;
    constructor(config: MagicIni);
    get(target: any, p: PropertyKey, _receiver: any): MagicDBMS;
}
//# sourceMappingURL=MagicDatabaseManager.d.ts.map