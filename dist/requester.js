"use strict";
/*/// <reference path="./node_modules/@types/node/index.d.ts" />*/
Object.defineProperty(exports, "__esModule", { value: true });
var java = require('java');
var path = require('path');
//java.library.path = __dirname;
java.classpath.push(path.resolve(__dirname, './lib/uniRequester.jar'));
java.classpath.push(path.resolve(__dirname, './lib/Magic.jar'));
let javaLangSystem = java.import('java.lang.System');
let javaLangClassLoader = java.import('java.lang.ClassLoader');
let MGRequester = java.import('br.com.vitalbyte.magic.MagicRequester');
exports.MagicException = java.import('br.com.vitalbyte.magic.exceptions.MagicException');
exports.MagicVariable = java.import('br.com.vitalbyte.magic.types.MagicVariable');
exports.MagicAlpha = java.import('br.com.vitalbyte.magic.types.MagicAlpha');
exports.MagicNumeric = java.import('br.com.vitalbyte.magic.types.MagicNumeric');
exports.MagicLogical = java.import('br.com.vitalbyte.magic.types.MagicLogical');
exports.MagicDate = java.import('br.com.vitalbyte.magic.types.MagicDate');
exports.MagicTime = java.import('br.com.vitalbyte.magic.types.MagicTime');
exports.MagicBlob = java.import('br.com.vitalbyte.magic.types.MagicBlob');
exports.MagicVariant = java.import('br.com.vitalbyte.magic.types.MagicVariant');
var databases = {};
function setLibraryPath(path) {
    javaLangSystem.setPropertySync("java.library.path", path);
    //set sys_paths to null
    var sysPathsField = javaLangClassLoader.class.getDeclaredFieldSync("sys_paths");
    sysPathsField.setAccessibleSync(true);
    sysPathsField.setSync(null, null);
}
function isOSWin64() {
    return process.arch === 'x64' || (process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432') && process.env.PROCESSOR_ARCHITEW6432 == 'AMD64');
}
function initLibraryPath() {
    setLibraryPath(path.join(__dirname, '..', 'bin', process.platform, process.arch));
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
        var self = this;
        var args = params;
        args.unshift(publicName);
        try {
            var prog = args.shift();
            var result = MGRequester.staticCallByNameSync(self.impl, prog, java.newArray("br.com.vitalbyte.magic.types.MagicVariable", args));
            callback(null, result);
        }
        catch (e) {
            //Integration.getInstance().log("ERRO self.impl.callByName");
            callback((e.javaException instanceof exports.MagicException) && e.javaException || e);
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