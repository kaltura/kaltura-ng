
const fs = require('fs');
const path = require('path');
const findRoot = require('./libs/find-root');
const getJsonIndent = require('./libs/get-json-indent');


// TODO should get this value from the args
var nodeModulesPath = '../node_modules';

var packageRoot = findRoot(process.cwd());

if (!packageRoot) throw new Error("couldn't find package root");

var tsConfigFilePath = path.resolve(packageRoot,'tsconfig.json');
var packageJsonFilePath = path.resolve(packageRoot,'package.json');

if (fs.existsSync(tsConfigFilePath) && fs.existsSync(packageJsonFilePath)) {
	var packageJson = JSON.parse(fs.readFileSync(packageJsonFilePath, 'utf8'));
	var tsConfigFileContent = fs.readFileSync(tsConfigFilePath, 'utf8');
	var tsConfig = JSON.parse(tsConfigFileContent);
	var tsConfigIndent = getJsonIndent(tsConfigFileContent) || 4;


	if (!tsConfig.compilerOptions)
	{
		tsConfig.compilerOptions = { paths : {}};
	}else if (!tsConfig.compilerOptions.paths)
	{
		tsConfig.compilerOptions.paths = {};
	}
	var tsConfigPaths = tsConfig.compilerOptions.paths;

	for (var tsConfigPath in tsConfigPaths) {
		var pathMapping = tsConfigPaths[tsConfigPath];

		if (pathMapping && pathMapping.length === 1 && pathMapping[0].indexOf(nodeModulesPath) === 0) {
			//console.log('remove path mapping for package ' + tsConfigPath);
			delete tsConfigPaths[tsConfigPath];
		}
	}

	if (packageJson.dependencies) {
		for (var packageJsonDependency in packageJson.dependencies) {
			//console.log('add path mapping for package ' + packageJsonDependency);
			tsConfigPaths[packageJsonDependency] = [nodeModulesPath + '/' + packageJsonDependency];
			tsConfigPaths[packageJsonDependency + '/*'] = [nodeModulesPath + '/' + packageJsonDependency + '/*'];
		}
	}

  console.warn('"fix-tsconfig-paths.js": this workaround has a permanent fix in typescript >= 2.5 (not currently supported by angular-cli 1.4.4). Please revise again when upgrading the application libraries.');

  fs.writeFileSync(tsConfigFilePath,JSON.stringify(tsConfig,null,tsConfigIndent));
	console.log('"fix-tsconfig-paths.js": updated tsconfig.file to include path mapping for all dependencies (essential to support npm link of packages)');
}
