List and load dependencies.

Based on https://github.com/jackfranklin/gulp-load-plugins.

### list (scope, config)
Returns an array of dependency names.

argument|type|default|description
---|---|---|---
scope|array|['dependencies', 'devDependencies', 'peerDependencies']|list of dependency types
config|string or object|'package.json'|path to package.json file or custom config object

```js
var deps = ldep.list(['dependencies']);
var deps = ldep.list(['devDependencies'], './package.json');
```

### load (deps, rename)
Attaches dependency names to a single variable. Dependencies are lazy loaded only when the dependency name is accessed.

argument|type|description
---|---|---
deps|array|list of dependency names
rename|function|function to customize name of each dependency. Takes 2 arguments - name of dependency and `camelize` function (which converts `gulp-plugin` to `gulpPlugin`) - and returns the modified name

```js
var deps = ldep.list();
var $ = ldep.load(deps);
// or simply
var $ = ldep.load(ldep.list());

// now instead of doing this
var moduleName = require('module-name');
// use it like this
$.moduleName // moduleName is loaded now
```

```js
var $ = ldep.load(ldep.list(['devDependencies'])), function(name, camelize) {
	return camelize(name.replace(/^gulp\-/, ''));
});
```

### like (match, deps)
This is a wrapper for [multimatch](https://www.npmjs.com/package/multimatch) implemented as `multimatch(deps, match)`.

argument|type
---|---
match|string or array
deps|array


```js
var deps = ldep.list();
// get only gulp plugins
var gulpPlugins = ldep.like('gulp-*', deps);
// or simply
var gulpPlugins = ldep.like('gulp-*', ldep.list());
// get only grunt plugins
var gruntPlugins = ldep.like('grunt-contrib-*', ldep.list());
```

### Usage
```bash
npm install ldep
```

```js
var ldep = require('ldep');
// load gulp plugins and rename them by removing 'gulp-' prefix and camelizing
var $ = ldep.load(ldep.like('gulp-*', ldep.list()), function(name, camelize) {
	return camelize(name.replace(/^gulp\-/, ''));
});
```

```js
// load gulp plugins only from devDependencies
var $ = ldep.load(ldep.like('gulp-*', ldep.list(['devDependencies'])), function(name, camelize) {
	return camelize(name.replace(/^gulp\-/, ''));
});
// or
var deps = ldep.list(['devDependencies']);
var gulpPlugins = ldep.like('gulp-*', deps);
function renameGulpPlugins(name, camelize) {
	return camelize(name.replace(/^gulp\-/, ''));
}
var plugins = ldep.load(gulpPlugins, renameGulpPlugins);
```
