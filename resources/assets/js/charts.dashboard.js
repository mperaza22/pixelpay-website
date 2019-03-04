"use strict";

var Charts = {};


Charts._pieCharts = {};


Charts.PIE_CHART_TYPES = {
	creditcard: { title: ' <br><b>Según Tarjeta de Crédito</b>', container: 'pie-chart-cc' },
	category: { title: ' <br><b>Según Tipo de Pago</b>', container: 'pie-chart-cat' },
	device: { title: ' <br><b>Por Dispositivo</b>', container: 'pie-chart-device' }
};

Charts.LINE_CHART_NOMECLATURES = {
	day: 'D MMMM',
	days: 'D MMMM YYYY',
	hour: 'hh A',
	month: 'MMMM',
};

Charts.buildLineChart = function(data, interval, noUpright) {
	if (Charts._lineChart) Charts._lineChart.destroy();

	if (!data.length) {
		// || data.length < 2
		$('#current-sale').attr('value', 0.00);
		Util.animateNumber($('#current-sale'));

		return Dashboard.nodata('line-chart');
	}

	var nomeclature = Charts.LINE_CHART_NOMECLATURES[interval.lesser];

	var currentSale = _.sumBy(data, 'sale') || 0.00;
	$('#current-sale').attr('value', currentSale);
	Util.animateNumber($('#current-sale'));

	var series = Util.calculateSeries(data, interval, noUpright);

	Dashboard.chartReady('line-chart');

	Charts._lineChart = Highcharts.chart('line-chart', {
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		chart: { 
			style: {
				fontFamily: "'Gotham Rounded', sans-serif"
			},
			backgroundColor: 'transparent',
			color: '#fff',
			height: 280,
			type: 'area'
		},
		title: { 
			align: 'left',
			style: {
				color: '#FFF',
				textTransform: 'uppercase',
				fontSize: 12,
			},
			margin: 40,
			text: interval.title 
		},
		yAxis: {
			gridLineColor: 'transparent',
			title: { 
				style: {
					color: '#fff',
				},
				text: 'Ventas en Lempiras' 
			},
			labels : {
				style: {
					color: '#fff'
				}
			},
			min: 0,
		},
		xAxis: {
			gridLineColor: '#ffffff',
			type: 'datetime',
			minTickInterval: 20000,
			tickPositioner: function (min, max) {
				var ticks = this.series[0].processedXData.slice();

				var first = _.first(ticks);
				var last = _.last(ticks);

				first = moment(first);
				last = moment(last);

				var delta = last.diff(first, interval.lesser, true);

				if (delta >= 40) {
					ticks = Util.reduceTicksCount({
						ticks: ticks,
						conditionLimit: 40,
						ticksPerAxis: 20,
						min: min,
						max: max
					});
				} else {
					var current = first;

					ticks = [ first.valueOf() ];
					_.times(delta, function () {
						current.add(1, interval.lesser);
						var now = current.valueOf();
						ticks.push(now);
					});
				}

				ticks.info = this.tickPositions.info;

				return ticks;
			}, 

			labels: {
				rotation: -45,
				formatter: function() {
					var timestamp = this.value;
					var nomeclature = Charts.LINE_CHART_NOMECLATURES[interval.lesser];
					var label = moment(timestamp).locale('es').format(nomeclature.replace('MMMM', 'MMM')).valueOf();

					return label;
				},
				style: {
					color: '#fff'
				}
			}
		},
		tooltip: {
			formatter: function (event) {
        		if (this.series.name == 'Promedio') return false;

				var time = moment(this.key).locale('es').format(nomeclature);
				var sale = Util.currency(this.y);
				return time + '<br>Venta: <b>' + sale + '</b>';
			},
			backgroundColor: '#fff',
			borderRadius: 4
		},
		plotOptions: {
			bar: {
				pointPadding: 0,
				borderWidth: 0
			},
			series: {
				events: {
					legendItemClick: function (event) {
						event.preventDefault();
					}
				},
				dataLabels: {
					enabled: true,
					crop: false,
					overflow: 'none',
					align: 'left',
					verticalAlign: 'middle',
					style: {
						textOutline: '2px #6F79CF'
					},
					formatter: function() {
						if (this.series.name != 'Promedio') return '';
						if (this.point.index > 0) return '';
						var amount = Util.currency(this.y);
						return '<span class="average-marker" style="baseline-shift:10px; opacity: 0.8; font-weight: normal;">'
						+ this.series.name + ': ' + amount +
						'</span>';
					}
				}
			},
			areaspline: {
				fillColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
					]
				},
				marker: { radius: 3 },
				color: '#fff',
				lineWidth: 2,
				states: {
					hover: { lineWidth: 3 }
				},
				threshold: null
			}
		},

		series: series
	});
};


Charts.buildPieChart = function (data, interval, type) {
	if (Charts._pieCharts[type]) Charts._pieCharts[type].destroy();
	var config = Charts.PIE_CHART_TYPES[type];

	Charts._pieCharts[type] = Highcharts.chart(config.container, {
		chart: {
			style: {
				fontFamily: "'Gotham Rounded', sans-serif"
			},
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: interval.title + config.title,
			align: 'left',
			style: {
				color: '#717171',
				textTransform: 'uppercase',
				fontSize: 12,
			},
			margin: 40,
		},
		tooltip: {
			formatter: function () {
				var key = this.key;
				var percentage = Util.percentage(this.percentage);
				var sale = Util.currency(this.y);
				return '<b>' + Lang.get('admin.chart.keys.' + key) + '</b><br>Porcentaje: <b>'+ percentage +'</b><br>Venta: <b>' + sale + '</b>';
			},
			backgroundColor: '#fff',
			borderRadius: 4
		},
		plotOptions: {
			pie: {
				colors: [
					'#00CC7B', 
					'#F4707B', 
					'#9F5AB1', 
					'#FFA738', 
					'#9245A7', 
					'#2A99D6', 
					'#D95C9B', 
					'#8F7260', 
					'#D6C29A', 
					'#9F5AB1'
				],
				cursor: 'pointer',
				dataLabels: {
					formatter: function() {
						return  Lang.get('admin.chart.keys.' + this.point.name) + 
							'<br>(' + Util.percentage(this.percentage) + ')';
					}
				},
			},
		},
		series: [{
			type: 'pie',
			name: 'Porcentaje',
			allowPointSelect: true,
			colorByPoint: true,
			data: data
		}]
	});
};


Charts.buildColChart = function (data, interval) {
	
	var container = $('[data-sales-by-users]');
	var basePercent = _.sumBy(data, 'y');
	var colors = [
		'#00CC7B', 
		'#F4707B', 
		'#9F5AB1', 
		'#FFA738', 
		'#9245A7', 
		'#2A99D6', 
		'#D95C9B', 
		'#8F7260', 
		'#D6C29A', 
		'#9F5AB1'
	];

	container.find('tbody').html('');
	container.find('[data-interval-title]').html(interval.title + ' <b>Según Usuario</b>');

	_.forEach(data, function(user, key){
		var percent = Util.percentageFrom(basePercent, user.y);
		var result = '<tr>';
		result += '<td>' + 
				user.name + 
				'<div class="progress">' + 
					'<div class="progress-bar" role="progressbar" style="background-color:' + colors[key % 10] + ';width: ' + percent + '%" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100"></div>' + 
				'</div>' +
			'</td>';
		result += '<td class="text-right">' + Util.currency(user.y) + '<br><small class="text-muted">(' + Util.percentage(percent) + ')</small></td>';
		result += '</tr>';

		container.find('tbody').append(result);
	});
};


Charts.buildGroup = function (data, interval, groupBy, container) {
	var $select = $(container + '-content').find('.js-group-by-user');

	var users = Util.unique(data, 'user');
	var options = Util.options(users);

	$select.html(options);

	$select.unbind('change').on('change', function () {
		var value = $select.val().trim();
		var filteredData;
		if (value) {
			filteredData = data.filter(function (row) { return row.user == value });
		} else {
			filteredData = data;
		}

		var cumulated = Util.groupingBy(filteredData, groupBy);
		Charts.buildPieChart(cumulated, interval, groupBy);
	});

	var cumulated = Util.groupingBy(data, groupBy);
	Charts.buildPieChart(cumulated, interval, groupBy);
};