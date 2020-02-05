/*/// <reference path="./node_modules/@types/node/index.d.ts" />*/

var java = require('java');
var path = require('path');


//java.library.path = __dirname;

java.classpath.push(path.resolve(__dirname, './lib/uniRequester.jar'));
java.classpath.push(path.resolve(__dirname, './lib/Magic.jar'));

let javaLangSystem = java.import('java.lang.System');
let javaLangClassLoader = java.import('java.lang.ClassLoader');
let MGRequester = java.import('br.com.vitalbyte.magic.MagicRequester');
export var MagicException = java.import('br.com.vitalbyte.magic.exceptions.MagicException');
export var MagicVariable = java.import('br.com.vitalbyte.magic.types.MagicVariable');
export var MagicAlpha = java.import('br.com.vitalbyte.magic.types.MagicAlpha');
export var MagicNumeric = java.import('br.com.vitalbyte.magic.types.MagicNumeric');
export var MagicLogical = java.import('br.com.vitalbyte.magic.types.MagicLogical');
export var MagicDate = java.import('br.com.vitalbyte.magic.types.MagicDate');
export var MagicTime = java.import('br.com.vitalbyte.magic.types.MagicTime');
export var MagicBlob = java.import('br.com.vitalbyte.magic.types.MagicBlob');
export var MagicVariant = java.import('br.com.vitalbyte.magic.types.MagicVariant');

var databases = {}


function setLibraryPath(path) {
    javaLangSystem.setPropertySync("java.library.path", path);

    //set sys_paths to null
    var sysPathsField = javaLangClassLoader.class.getDeclaredFieldSync("sys_paths");
    sysPathsField.setAccessibleSync(true);
    sysPathsField.setSync(null, null);
}

function initLibraryPath() {
	setLibraryPath(path.join(__dirname, '..', 'bin', process.platform, process.arch));
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
	callByName(publicName: string, params: Array<any>, callback: (err:any, result?:any) => any) {
		var self = this;

		var args = params;

		args.unshift(publicName);

		try {
			var prog = args.shift();
			var result = MGRequester.staticCallByNameSync(self.impl, prog,  java.newArray("br.com.vitalbyte.magic.types.MagicVariable", args));

			callback(null, result);

		}
		catch(e) {
			//Integration.getInstance().log("ERRO self.impl.callByName");
			callback((e.javaException instanceof MagicException) && e.javaException || e);
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
