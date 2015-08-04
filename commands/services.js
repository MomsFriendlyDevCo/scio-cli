var _ = require('lodash');
var cliTable = require('cli-table');

module.exports = function(finish, scio) {
	scio.getServices(function(err, data) {
		if (err) return finish(err);
		var table = new cliTable({
			head: ['#', 'Parent', 'Ref', 'Name', 'Plugin', 'Address', 'Status'],
			chars: scio.config.formatting.tables.chars,
			style: scio.config.formatting.tables.style,
		});
		data.forEach(function(service, offset) {
			table.push([
				offset + 1,
				service.server.name || service.server.address || 'none',
				service.ref || 'none',
				service.name || 'none',
				service.plugin || 'none',
				service.address || 'none',
				service.status,
			]);
		});
		console.log(table.toString());
		finish();
	});
};
