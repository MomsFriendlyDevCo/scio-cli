var _ = require('lodash');
var cliTable = require('cli-table');

module.exports = function(finish, scio) {
	scio.getServers(function(err, data) {
		if (err) return finish(err);
		var table = new cliTable({
			head: ['#', 'Ref', 'Name', 'Address', 'Status'],
			chars: scio.config.formatting.tables.chars,
			style: scio.config.formatting.tables.style,
		});
		data.forEach(function(server, offset) {
			table.push([
				offset + 1,
				server.ref || 'none',
				server.name || 'none',
				server.address || 'none',
				server.status,
			]);
		});
		console.log(table.toString());
		finish();
	});
};
