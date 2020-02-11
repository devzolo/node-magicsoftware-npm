/* eslint-disable @typescript-eslint/no-explicit-any */
/*/// <reference path="./node_modules/@types/node/index.d.ts" />*/

import java from 'java';
import path from 'path';

java.classpath.push(path.resolve(path.join(__dirname, '..', 'lib', 'uniRequester.jar')));
java.classpath.push(path.resolve(path.join(__dirname, '..', 'lib', 'Magic.jar')));

const javaLangSystem = java.import('java.lang.System');
const javaLangClassLoader = java.import('java.lang.ClassLoader');
const MGRequester = java.import('br.com.vitalbyte.magic.MagicRequester');
export const MagicException = java.import('br.com.vitalbyte.magic.exceptions.MagicException');
export const MagicVariable = java.import('br.com.vitalbyte.magic.types.MagicVariable');
export const MagicAlpha = java.import('br.com.vitalbyte.magic.types.MagicAlpha');
export const MagicNumeric = java.import('br.com.vitalbyte.magic.types.MagicNumeric');
export const MagicLogical = java.import('br.com.vitalbyte.magic.types.MagicLogical');
export const MagicDate = java.import('br.com.vitalbyte.magic.types.MagicDate');
export const MagicTime = java.import('br.com.vitalbyte.magic.types.MagicTime');
export const MagicBlob = java.import('br.com.vitalbyte.magic.types.MagicBlob');
export const MagicVariant = java.import('br.com.vitalbyte.magic.types.MagicVariant');

function setLibraryPath(path: string): void {
  javaLangSystem.setPropertySync('java.library.path', path);

  //set sys_paths to null
  const sysPathsField = javaLangClassLoader.class.getDeclaredFieldSync('sys_paths');
  sysPathsField.setAccessibleSync(true);
  sysPathsField.setSync(null, null);
}

function initLibraryPath(): void {
  setLibraryPath(path.resolve(path.join(__dirname, '..', 'bin', process.platform, process.arch)));
}

initLibraryPath();

export class MagicRequester {
  public impl: any;

  constructor(public app: string, public server: string) {
    this.app = app;
    this.server = server;
    this.impl = new MGRequester(app, server);
  }

  /**
   * The callByName method lets you call a program in a remote engine.
   * @method callByName
   * @param publicName publicName – The public name of the program to be executed.
   * @param params params – Parameters.
   * @param callback callback – Result callback.
   * @returns The actual values represented by logical names and nested logical names.
   */
  callByName(publicName: string, params: Array<any>, callback: (err: any, result?: any) => any): any {
    const args = params;

    args.unshift(publicName);

    try {
      const prog = args.shift();
      const result = MGRequester.staticCallByNameSync(
        this.impl,
        prog,
        java.newArray('br.com.vitalbyte.magic.types.MagicVariable', args),
      );

      callback(null, result);
    } catch (e) {
      //Integration.getInstance().log("ERRO self.impl.callByName");
      callback((e.javaException instanceof MagicException && e.javaException) || e);
    }
  }
}

/*
public static void addLibraryPath(String pathToAdd) throws Exception{
    final Field usrPathsField = ClassLoader.class.getDeclaredField("usr_paths");
    usrPathsField.setAccessible(true);

    //get array of paths
    final String[] paths = (String[])usrPathsField.get(null);

    //check if the path to add is already present
    for(String path : paths) {
        if(path.equals(pathToAdd)) {
            return;
        }
    }

    //add the new path
    final String[] newPaths = Arrays.copyOf(paths, paths.length + 1);
    newPaths[newPaths.length-1] = pathToAdd;
    usrPathsField.set(null, newPaths);
}
*/
