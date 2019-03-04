"use strict";

var Util = {};


Util.GROUP_NOMECLATURE = {
	year:  'YYYY-MM-DD',
	month: 'YYYY-MM-DD',
	week:  'YYYY-MM-DD',
	day:   'YYYY-MM-DD HH:00:00',
	ytd:   'YYYY-MM-01'
};


Util.formatDemoData = function (raw) {
	var collection = raw.map(function (row) {
		return {
			datetime: (+row.datetime) * 1000,
			sale: +(row.sale.replace(',', '')),
			user: row.user,
			creditcard: row.creditcard
		};
	});

	return collection;
};


Util.percentage = function (amount) {
	return parseFloat(amount).toFixed(1) + '%';
};


Util.currency = function (amount) {
	return (Util.currencySymbol() || '') + ((amount || 0).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
};

Util.currencySymbol = function () {
	var currency = $('meta[name="app_currency"]').attr('content'),
		localCurrency = $('meta[name="app_local_currency"]').attr('content'),
		localCurrencySymbol = $('meta[name="app_local_currency_symbol"]').attr('content');

	if(currency == localCurrency)
		return localCurrencySymbol;

	if(currency == 'USD')
		return '$';
};

Util.unique = function (data, column) {
	var values = _(data)
	.map(function (row) { return row[column]; })
	.sort().uniq().value();

	return values;
};

Util.clone = function (obj) {
  var json = JSON.stringify(obj);
  return JSON.parse(json);
};

Util.options = function (users) {
	return '<option value="">Todos</option>\n' +
	(users.map(function (user) {
		return '<option value="'+user+'">'+user+'</option>\n';
	}).join(''));
};


Util.groupingByDate = function(data, unit, interval) {
	var grouped = {};
	var nomeclature = Util.GROUP_NOMECLATURE[unit];
	
	data.forEach(function (row) {
		
		var index = moment(row.datetime).format(nomeclature);
		var totalSoFar = grouped[index] || 0;
		totalSoFar += row.sale;

		grouped[index] = totalSoFar;

	});

	var pairs = _.toPairs(grouped);

	data = pairs.map(function (pair) {
		return {
			datetime: moment(pair[0]).valueOf(),
			sale: pair[1]
		};
	});

	data = _.sortBy(data, 'datetime');
	return data;
};


Util.groupingBy = function (sales, column) {
	var data = [];
	
	var groups = _.groupBy(sales, column);
	
	_.forEach(groups, function (groupedData, group) {
		data.push({
			name: group,
			y: _.sumBy(groupedData, 'sale')
		})
	});

	data = _.sortBy(data, column);
	
	return data;
};


Util.calculateSeries = function (data, interval, noUpright) {
	var limitDate = data[data.length - 2].datetime;
	var currentSale = _.last(data).sale;
	var currentSaleStr = Util.currency(currentSale);
	var average = _.meanBy(data, 'sale');
	
	$('#current-sale').val(currentSaleStr);

	var addUpright = Util.enoughDataForUpright(data) && !noUpright;

	if (addUpright) {
		data.pop();
		Util.addUpright(data, interval);
	}

	data = Util.plotBySales(data);

	var series = [{
		type: 'areaspline',
		name: 'Ventas',
		data: data,
		zoneAxis: 'x',
		marker: {
			symbol: 'circle'
		}
	}];

	if (addUpright) {
		var seriesUpright = series[0];
		var upright = _.last(seriesUpright.data)[1];
		var lastIndex = seriesUpright.data.length - 1;

		series.push(Util.clone(seriesUpright));
		series.push(Util.clone(seriesUpright));

		var seriesCurrent = series[1];
		var seriesAverage = series[2];

		seriesCurrent.data[lastIndex][1] = currentSale;
		seriesUpright.data[lastIndex] = {
			x: seriesCurrent.data[lastIndex][0],
			y: upright,
			marker: {
				symbol: 'circle',
				fillColor: '#4785B9',
				lineColor: '#fff',
				lineWidth: 2,
				width: 6,
				height: 6
			}
		};

		seriesUpright.zones = [{
			value: limitDate,
			dashStyle: 'solid',
			color: 'transparent'
		}, {
			dashStyle: 'ShortDot',
			color: 'rgba(255,255,255,0.7)'
		}];

		seriesCurrent.id = 'main';

		seriesAverage.name = 'Promedio';
		seriesAverage.dashStyle = 'Dash';
		seriesAverage.color = 'rgba(255,255,255,0.4)';
		seriesAverage.enableMouseTracking = false;
		seriesAverage.data = seriesAverage.data.map(function (pair) {
			pair[1] = average;
			return pair;
		});

		seriesAverage.lineWidth = 1;
		seriesAverage.states = {
			hover: {
				lineWidth: 1
			}
		}
		seriesAverage.showInLegend = false;
		seriesAverage.line = {
			tooltip: { followPointer: false }
		};
		seriesAverage.tooltip = {
			enabled: false
		};
		seriesAverage.marker = {
			enabled: false
		}

		series = [seriesAverage, seriesUpright, seriesCurrent];
	}

	return series;
};

Util.addMissingIntervals = function (data, conf) {
	if (data.length == 0)
		return [];

	var interval = conf.interval.lesser;
	var start = moment(conf.start).valueOf();
	var end = moment(conf.end).valueOf();


	var firstValue = _.first(data).datetime;
	var lastValue = _.last(data).datetime;
	var values = [firstValue];


  // Values from start
  while (start < lastValue) {
	lastValue = moment(lastValue).subtract(1, interval).valueOf();
	values.push(lastValue);
  }

  // Values from end  
  while (end > firstValue) {
	firstValue = moment(firstValue).add(1, interval).valueOf();
	values.push(firstValue);
  }

  // remove duplicates
  values = _.sortBy(values);
  values = _.uniq(values);

  // cut out clutter
  if (values.length != data.length) {
	if (_.last(values) > _.last(data).datetime) values.pop();
	if (_.first(values) < _.first(data).datetime) values.shift();
  }

  var newData = values.map(function (timestamp) {
	var row = data.find(function (r) { return r.datetime == timestamp; });
	if (!row) {
		row = { datetime: timestamp, sale: 0 };
	}
	return row;
  });

  return newData;
}

Util.addUpright = function (data, interval) {
	if (!Util.enoughDataForUpright(data)) return false;

	var nextDate = Util.calculateNextDate(data, interval);
	var avgUpright = Util.calculateAvgUpright(data);
	var diffUpright = Util.calculateDiffUpright(data);
	var positiveDiffUpright = Util.calculateDiffUpright(data, 4, true);
	
	var uprightsAvg = (avgUpright, diffUpright, positiveDiffUpright)

	data.push({
		datetime: nextDate,
		sale: positiveDiffUpright
	});

	return true;
};


Util.enoughDataForUpright = function (data) {
  return data.length > 2; // <- this value can be dynamic
};


Util.calculateNextDate = function (data, interval) {
	var lastDate = _.last(data).datetime;
	var newDate = moment(lastDate).add(1, interval.lesser).valueOf();
	return newDate;
};


Util.calculateAvgUpright = function (data) {
	var last3 = _.takeRight(data, 3);
	var average = _.meanBy(last3, 'sale');
	return average;
};


Util.calculateDiffUpright = function (data, count, justPositives) {
	if (data.length < 2) return 0;
	
	if (count) {
		data = _.takeRight(data, count);
	}

	var diffs = _.times(data.length - 1);
	diffs = diffs.map(function (__, index) {
		return data[index + 1].sale - data[index].sale; 
	});

	if (justPositives) {
		// diffs = diffs.filter(value => value > 0);
		diffs = diffs.filter(function(value) { return value > 0});
	}

	var average = _.mean(diffs) || 0;
	var lastSale = _.last(data).sale;
	var upright = lastSale + average;

	return upright;
};


Util.plotBySales = function (data) {
	data = _.sortBy(data, ['datetime']);

	return data.map(function (row) {
		return [row.datetime, row.sale];
	});
};


Util.plotByUser = function (data) {
	data = _.sortBy(data, 'name');
	data = data.map(function (row, n) {
		return {
			name: row.name,
			key: row.name,
			data: [row.y],
			legendIndex: n
		}
	});

	return data;
};


Util.reduceTicksCount =  function (config) {
	var ticks = config.ticks,
	conditionLimit = config.conditionLimit,
	ticksPerAxis = config.ticksPerAxis,
	min = config.min,
	max = config.max;

	var amount = ticks.length;
	if (amount > conditionLimit) {
		var diff = max - min;
		var step = (diff / ticksPerAxis) >> 0;

		var counter = min;
		ticks = _.times(ticksPerAxis, '').map(function () {
			counter += step;
			return counter;
		})
	}

	return ticks;
};

Util.animateNumber = function(el){
	var decimal_places = el.attr('decimal') || 0;
	var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);

	el.animateNumber({ 
		number: el.attr('value') * decimal_factor, 
		numberStep: function(now, tween) {
			var floored_number = Math.floor(now) / decimal_factor,
			target = $(tween.elem);

			if (decimal_places > 0)
				floored_number = floored_number.toFixed(decimal_places);

			floored_number = floored_number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			target.text(floored_number);
		}
	}, 750);
};

Util.percentageFrom = function(from, to){
	return (to/from*100).toFixed(2);
};