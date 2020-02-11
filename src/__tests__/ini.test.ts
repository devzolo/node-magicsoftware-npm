import path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
import { MagicIni } from '../ini';

describe('MagicIni Tests', () => {
  const magicIniFile: string = process.env.MAGIC_INI as string;
  expect(magicIniFile).not.toBeUndefined();
  expect(magicIniFile).not.toBeNull();

  const ini = new MagicIni(path.resolve(__dirname, magicIniFile));

  it('translate test', () => {
    expect(ini.translate('%TEST%')).toBe('Test Logical Name');
  });
});
