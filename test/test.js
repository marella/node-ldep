var ldep = require('../index.js');
var _ = require('lodash');

function assertEqual(val1, val2) {
	if (!_.isEqual(val1, val2)) {
		console.log(val1, val2);
		throw new Error('FAIL');
	}
}

var dataConfig = {
	dependencies: {
		"dep-a": "*",
		"dep-b": "*"
	},
	devDependencies: {
		"dev-dep-a": "*",
		"dev-dep-b": "*"
	},
	peerDependencies: {
		"peer-dep-a": "*",
		"peer-dep-b": "*"
	},
};

var dataDeps = {
	dependencies: ['dep-a', 'dep-b'],
	devDependencies: ['dev-dep-a', 'dev-dep-b'],
	peerDependencies: ['peer-dep-a', 'peer-dep-b'],
};

function config(keys) {
	return _.pick(dataConfig, keys);
}

function deps(keys) {
	var d = _.pick(dataDeps, keys);
	var ret = [];
	_.forIn(d, function(value, key) {
		ret = ret.concat(value);
	})
	return ret;
}

// test list

assertEqual(
	ldep.list(['dependencies'], config(['dependencies'])),
	deps(['dependencies'])
);

assertEqual(
	ldep.list(['devDependencies'], config(['dependencies'])),
	[]
);

assertEqual(
	ldep.list(['dependencies', 'devDependencies'], config(['dependencies', 'devDependencies'])),
	deps(['dependencies', 'devDependencies'])
);

assertEqual(
	ldep.list(config(['dependencies', 'devDependencies', 'peerDependencies'])),
	deps(['dependencies', 'devDependencies', 'peerDependencies'])
);

// test load

var $;
$ = ldep.load(ldep.list());
assertEqual($.lodash, _);
assertEqual($.lodash, _); // test again as getter is deleted and property is set

$ = ldep.load(ldep.like('!lodash', ldep.list()));
assertEqual(_.isUndefined($.lodash), true);

console.log('PASS');
