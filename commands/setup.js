var async = require('async-chainable');
var fs = require('fs');
var request = require('superagent');

module.exports = function(finish, program) {

	async()
		.forEach(program.args, function(next, arg) {
			fs.exists(arg, function(exists) {
				if (!exists) return next('File not found: ' + arg);
				next();
			});
		})
		.then('res', function(next) {
			// Add upload to queue {{{
			var request = request.post(program.settings.url + '/api/plugins/parse')
				.type('form');

			program.args.forEach(function(arg, offset) {
				request.attach('file-' + offset, arg)
			});
				
			console.log('Uploading...');
			request.end(function(err, res) {
				if (err) return console.log('ERROR', err);
				if (!res.ok || res.statusCode != 200) return console.log("Failed upload, return code: " + res.statusCode + ' - ' + res.text);
				next(null, res.body);
			})
			// }}}
		})
		.then(function(next) {
			console.log('RESPONSE', this.res);
			next();
		})
		.end(finish);
};
