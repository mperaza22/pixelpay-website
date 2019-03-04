"use strict";

var Dashboard = {};


Dashboard.INTERVALS = {
	year:  { id: 'year',  lesser: 'month', formatStart: 'YYYY-MM-DD 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas del Año' },
	week:  { id: 'week',  lesser: 'day',   formatStart: 'YYYY-MM-DD 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas de la Semana' },
	day:   { id: 'day',   lesser: 'hour',  formatStart: 'YYYY-MM-DD 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas del Día' },
	month: { id: 'month', lesser: 'day',   formatStart: 'YYYY-MM-01 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas del Mes Actual' },
	ytd:   { id: 'ytd',   lesser: 'month', formatStart: 'YYYY-01-01 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas del Año Actual' },
	range: { id: 'range', lesser: 'days',  formatStart: 'YYYY-MM-DD 00:00:00', formatEnd: 'YYYY-MM-DD 23:59:59', title: 'Ventas por Rango de Fecha' },
};

Dashboard.APIURL = function (p) {
	return '/admin/dashboard/sales/' + [p.start, p.finish, p.groupby].join('/') + (Dashboard.COMPANY ? '?company=' + Dashboard.COMPANY : '');
};


Dashboard.init = function(company) {
	Dashboard.COMPANY = company;
	moment.updateLocale($('html').attr('lang'), { week: { dow: 0 } });

	Dashboard.bindings();
	Dashboard.prepare($('#line-chart').data('default'));
};


Dashboard.bindings = function () {
	var startDefault = moment().startOf('month');
	var endDefault = moment().endOf('month');

	$('.js-group').click(function () {
		var $el = $(this);
		var i = $el.data('interval');
		Dashboard.prepare(i);

		if(i == 'range')
			Dashboard.prepareRange(startDefault, endDefault);
	});

	new Calendar({
		element: $('.daterange--double'),
		earliest_date: moment($('.daterange--double').data('earliest-date')),
		latest_date: moment(),
		start_date: startDefault,
		end_date: endDefault,
		presets: false,
		callbackAlways: true,
		callback: function() {
			startDefault = moment(this.start_date);
			endDefault = moment(this.end_date);

			Dashboard.prepareRange(moment(this.start_date), moment(this.end_date));
		}
	});
};


Dashboard.hilightActive = function(i) {
	$('.js-group').removeClass('active');
	$('.js-group[data-interval='+i+']').addClass('active');
};


Dashboard.prepare = function(i) {
	Dashboard.hilightActive(i);

	var interval = Dashboard.INTERVALS[i];

	if (i == 'range') {
		Dashboard.nodata();
		Dashboard.showRange();
		return;
	}

	Dashboard.loading();
	Dashboard.hideRange();
	Dashboard.buildData(interval);
};


Dashboard.prepareRange = function(start, finish) {
	if (!start || !finish) return;
	var interval = Dashboard.INTERVALS.range;

	Dashboard.loading();
	Dashboard.buildData(interval, start, finish, true);
};


Dashboard.buildData = function(interval, firstMoment, lastMoment, noUpright) {
	var type = interval.id;
	var now = new Date();
	var start, finish;

	if (type != 'range') {
		start = moment(now);

		if (type != 'ytd' && type != 'month') {
			start.subtract(1, type);
		}
		start = start.format(interval.formatStart);
		finish = moment(now).format(interval.formatEnd);
	} else {
		start = firstMoment.format(interval.formatStart);
		finish = lastMoment.format(interval.formatEnd);
	}

	return Dashboard.getData(interval, start, finish).then(function (data) {
		var cumulatedDate = Util.groupingByDate(data, type, interval);
		var cumulatedUser = Util.groupingBy(data, 'user');
		cumulatedUser = _.orderBy(cumulatedUser, 'y', 'desc');

		cumulatedDate = Util.addMissingIntervals(cumulatedDate, {
			interval: interval,
			start: start,
			end: finish
		});

		Charts.buildLineChart(cumulatedDate, interval, noUpright);
		Charts.buildColChart(cumulatedUser, interval);

		Charts.buildGroup(data, interval, 'creditcard', '.js-credit-card-chart');
		Charts.buildGroup(data, interval, 'category', '.js-category-chart');
		Charts.buildGroup(data, interval, 'device', '.js-device-chart');
	});
};


Dashboard.getData = function(interval, start, finish) {
	var type = interval.id;
	var groupby = interval.lesser;

	var url = Dashboard.APIURL({ start: start, finish: finish, groupby: groupby });
	return $.getJSON(url);
};


Dashboard.loading = function() {
	$('.main-chart').hide();
	$('.aditional-charts').hide();
	$('.loader').show();
};


Dashboard.chartReady = function() {
	$('.is-empty').hide();
	$('.main-chart').show();
	$('.aditional-charts').show();
	$('.line-chart-container').show();
	$('.loader').hide();
};


Dashboard.nodata = function() {
	$('.is-empty').show();
	$('.main-chart').show();
	$('.aditional-charts').hide();
	$('.line-chart-container').hide();
	$('.loader').hide();

	Charts._lineChart = 0;
};


Dashboard.showRange = function() {
	Dashboard.prepareRange();

	$('.date-range').show();
	$('.is-empty').hide();
};


Dashboard.hideRange = function() {
	$('.date-range').hide();
};