var findup = require('findup-sync');
var multimatch = require('multimatch');
var path = require('path');

var parentDir = path.dirname(module.parent.filename);
var defaults = {
	scope: ['dependencies', 'devDependencies', 'peerDependencies'],
	config: findup('package.json', {cwd: parentDir}),
	rename: function(name, camelize) {
		return camelize(name);
	},
};

function camelize(str) {
	return str.replace(/-(\w)/g, function(m, p1) {
		return p1.toUpperCase();
	});
}

function isArray(v) {
	return Array.isArray(v);
}

function isString(v) {
	return (typeof v === 'string' || v instanceof String);
}

function list(scope, config) {
	if (!isArray(scope)) {
		config = scope;
		scope = null;
	}
	scope = scope || defaults.scope;
	config = config || defaults.config;

	if (isString(config)) {
		config = require(config);
	}

	return scope.reduce(function(result, prop) {
		return result.concat(Object.keys(config[prop] || {}));
	}, []);
}

function like(match, deps) {
	return multimatch(deps, match);
}

function defineProperty($, name, realname) {
	if ($[name]) {
		throw new Error('Duplicate name ' + name + ' for ' + realname);
	}
	Object.defineProperty($, name, {
		get: function() {
			delete this[name]; // delete getter method and assign name as property
			return this[name] = require(realname);
		}
	});
}

function load(deps, rename) {
	var $ = {};
	rename = rename || defaults.rename;
	deps.forEach(function(dep) {
		defineProperty($, rename(dep, camelize), dep);
	});
	return $;
}

module.exports = {
	list: list,
	like: like,
	load: load,
};
