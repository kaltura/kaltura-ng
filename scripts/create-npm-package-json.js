
const getJsonIndent = require('./libs/get-json-indent');

module.exports = createNpmPackageJson;

function createNpmPackageJson(packageContentAsString) {

	if (packageContentAsString) {

		var packageIndent = getJsonIndent(packageContentAsString) || 4;
		var packageContent = JSON.parse(packageContentAsString);

		packageContent.devDependencies = {};
		packageContent.peerDependencies = packageContent.dependencies;
		packageContent.dependencies = {};
		packageContent.scripts = {};
		packageContent.private = false;

		if (packageContent.config && packageContent.config.npmDistDirectory) {
			delete packageContent.config.npmDistDirectory;
		}

		return JSON.stringify(packageContent,null,packageIndent);
	}
}