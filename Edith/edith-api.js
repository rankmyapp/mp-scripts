/**
 * updateNegativeList
 */

function updateNegativeList() {
	const _handleResetRows = (table) => {
		const ss = SpreadsheetApp.getActive();
		const sheetCanalDevice = ss.getSheetByName(table);

		sheetCanalDevice.getRange('A3:B').clearContent();
		sheetCanalDevice.getRange('E3:F').clearContent();
	};

	/**
	 * Apply data in the Table of channel
	 *
	 * @param {string} table The table name (ANDROID or iOS).
	 * @param {array} sourceRows The map with data to apply
	 * @param {any} subSourceRows The map with data to apply
	 * @return void
	 * @customfunction
	 */
	const _applyDataOnTable = (table) => {
		return (sourceRows, subSourceRows) => {
			Logger.log(sourceRows);
			Logger.log(subSourceRows);
			_handleResetRows(table);

			Logger.log(table)
			const ss = SpreadsheetApp.getActive();
			const sheetCanalDevice = ss.getSheetByName(table);

			if (sourceRows.length) {
				const range = sheetCanalDevice.getRange('A3:B' + (3 + sourceRows.length - 1));
				range.setValues(sourceRows);
			}

			if (subSourceRows.length) {
				const range = sheetCanalDevice.getRange('E3:F' + (3 + subSourceRows.length - 1));
				range.setValues(subSourceRows);
			}

			this.getModule('edith')().showFeedback({
				suffix: 'Negative List',
				description:
					'Negative list ' +
					table +
					' updated. \n\n' +
					(subSourceRows.length + sourceRows.length) +
					' items finded.',
			});
		};
	};

	/**
	 * function to separate the data in rows
	 * 
	 * @param {*} data 
	 * @param {*} campaignId 
	 * @param {*} channelName 
	 * @returns 
	 */
	const _getRows = (data, campaignId, channelName) => {
		const sourceRows = [];
		const subSourceRows = [];
		const blocksToCampaign = data.filter(block => block.campaignId === campaignId)

		const sourceRules = blocksToCampaign.map(block => block.rules.filter(rule => rule.variable === 'source' && rule.logic === 'deny')).flat()
		const subSourceRules = blocksToCampaign.map(block => block.rules.filter(rule => rule.variable === 'p2' && rule.logic === 'deny')).flat()

		const sourcesToBlock = new Set(sourceRules.map(source => source.values).flat());
		const subSourcesToBlock = new Set(subSourceRules.map(sub => sub.values).flat());

		[...sourcesToBlock].forEach(source => sourceRows.push([channelName, source]));
		[...subSourcesToBlock].forEach(sub => subSourceRows.push([channelName, sub]));

		return { sourceRows, subSourceRows };
	}

	/**
	 * Get data from EDITH
	 * @param {*} campaignId 
	 * @param {*} channelName 
	 * @param {*} channelId 
	 * @param {*} apiKey 
	 * @param {_applyDataOnTable} callback The callback to apply data in the table
	 * @return void
	 * @customfunction
	 */
	const _requestNegativeList = (campaignId, channelName, channelId, apiKey, callback) => {
		const data = this.getModule('edith')().request.get(
			'/negative-list', {}, {
			channelId,
		}, { apiKey }
		);

		if (typeof data !== 'object') return;

		const { sourceRows, subSourceRows } = _getRows(data, campaignId, channelName);

		callback(sourceRows, subSourceRows);
	};

	const ss = SpreadsheetApp.getActive();
	const config = ss.getSheetByName('Config');

	const channelName = config.getRange('B3').getValue();
	const channelId = config.getRange('B4').getValue();
	const apiKey = config.getRange('B5').getValue();
	const campaignId = config.getRange('B6').getValue();

	_requestNegativeList(
		campaignId.toString(),
		channelName,
		channelId,
		apiKey,
		_applyDataOnTable(channelName)
	);
}
