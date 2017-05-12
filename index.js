var java = require('java');
var path = require('path');

//java.library.path = __dirname;

java.classpath.push(path.resolve(__dirname, './lib/uniRequester.jar'));
java.classpath.push(path.resolve(__dirname, './lib/Magic.jar'));

var javaLangSystem = java.import('java.lang.System');
var javaLangClassLoader = java.import('java.lang.ClassLoader');
var MagicRequester = java.import('br.com.vitalbyte.magic.MagicRequester');
var MagicException = java.import('br.com.vitalbyte.magic.exceptions.MagicException');
var MagicVariable = java.import('br.com.vitalbyte.magic.types.MagicVariable');
var databases = {}


function setLibraryPath(path) {
    javaLangSystem.setPropertySync("java.library.path", path);
 
    //set sys_paths to null
    var sysPathsField = javaLangClassLoader.class.getDeclaredFieldSync("sys_paths");
    sysPathsField.setAccessibleSync(true);
    sysPathsField.setSync(null, null);
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

setLibraryPath(__dirname);

class Requester {
	
	constructor(app, server) {
		this.app = app;
		this.server = server;
		this.impl = new MagicRequester(app, server);
	}
	
	callByName(publicName, params, callback)
	{
		var self = this;
		
		var args = params; 
		
		args.unshift(publicName);
		
		try {
			var prog = args.shift();
			var result = MagicRequester.staticCallByNameSync(self.impl, prog,  java.newArray("br.com.vitalbyte.magic.types.MagicVariable", args));
				
			callback(null, result);
			
		}
		catch(e) {
			//Integration.getInstance().log("ERRO self.impl.callByName");
			callback((e.javaException instanceof MagicException) && e.javaException || e);
		}
	}
	
}
	
module.exports.Requester = Requester;



	
	