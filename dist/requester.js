"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*/// <reference path="./node_modules/@types/node/index.d.ts" />*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const java_1 = __importDefault(require("java"));
const path_1 = __importDefault(require("path"));
java_1.default.classpath.push(path_1.default.resolve(__dirname, '..', 'lib/uniRequester.jar'));
java_1.default.classpath.push(path_1.default.resolve(__dirname, '..', 'lib/Magic.jar'));
const javaLangSystem = java_1.default.import('java.lang.System');
const javaLangClassLoader = java_1.default.import('java.lang.ClassLoader');
const MGRequester = java_1.default.import('br.com.vitalbyte.magic.MagicRequester');
exports.MagicException = java_1.default.import('br.com.vitalbyte.magic.exceptions.MagicException');
exports.MagicVariable = java_1.default.import('br.com.vitalbyte.magic.types.MagicVariable');
exports.MagicAlpha = java_1.default.import('br.com.vitalbyte.magic.types.MagicAlpha');
exports.MagicNumeric = java_1.default.import('br.com.vitalbyte.magic.types.MagicNumeric');
exports.MagicLogical = java_1.default.import('br.com.vitalbyte.magic.types.MagicLogical');
exports.MagicDate = java_1.default.import('br.com.vitalbyte.magic.types.MagicDate');
exports.MagicTime = java_1.default.import('br.com.vitalbyte.magic.types.MagicTime');
exports.MagicBlob = java_1.default.import('br.com.vitalbyte.magic.types.MagicBlob');
exports.MagicVariant = java_1.default.import('br.com.vitalbyte.magic.types.MagicVariant');
function setLibraryPath(path) {
    javaLangSystem.setPropertySync('java.library.path', path);
    //set sys_paths to null
    const sysPathsField = javaLangClassLoader.class.getDeclaredFieldSync('sys_paths');
    sysPathsField.setAccessibleSync(true);
    sysPathsField.setSync(null, null);
}
function initLibraryPath() {
    setLibraryPath(path_1.default.join(__dirname, '..', 'bin', process.platform, process.arch));
}
initLibraryPath();
class MagicRequester {
    constructor(app, server) {
        this.app = app;
        this.server = server;
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
    callByName(publicName, params, callback) {
        const args = params;
        args.unshift(publicName);
        try {
            const prog = args.shift();
            const result = MGRequester.staticCallByNameSync(this.impl, prog, java_1.default.newArray('br.com.vitalbyte.magic.types.MagicVariable', args));
            callback(null, result);
        }
        catch (e) {
            //Integration.getInstance().log("ERRO self.impl.callByName");
            callback((e.javaException instanceof exports.MagicException && e.javaException) || e);
        }
    }
}
exports.MagicRequester = MagicRequester;
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
//# sourceMappingURL=requester.js.map