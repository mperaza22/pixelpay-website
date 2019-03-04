@if (Auth::check() && Auth::user()->is_superuser)
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>PixelPay Logs</title>

	<link rel="shortcut icon" href="{{ URL::asset('public/images/favicon.ico') }}" />
	<link rel="icon" type="image/png" href="{{ URL::asset('public/images/favicon.png') }}" />

	<link rel="stylesheet" href="{{ URL::asset('public/fonts/gotham/stylesheet.css') }}">
	<link rel="stylesheet" href="{{ URL::asset('public/css/admin-vendor.css') }}">
	<link rel="stylesheet" href="{{ URL::asset('public/css/admin.css') }}">


	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
<style>
	body {
		padding: 25px;
	}

	h1 {
		font-size: 1.5em;
		margin-top: 0;
	}

	.stack {
		margin-top: 20px;
		border-top: 1px solid #eee; 
		font-size: 1em;
		font-family: "Lucida Console", Monaco, monospace;

		white-space: pre-wrap;
		word-break: break-all;
	}

	.stack pre, .log-code{
		white-space: pre-wrap;
		word-break: break-all;
	}

	.date {
		min-width: 75px;
	}

	.text {
		word-break: break-all;
	}

	a.llv-active {
		z-index: 2;
		background-color: #f5f5f5;
		border-color: #777;
	}
	div.action-buttons{
		margin-top: 10px;
	}
	div.action-buttons a.dt-button {
		padding: 8px 12px;
		color: #fff;
		background-color: #3E32B3;
		border-radius: 3px;
		text-decoration: none;
		margin: 0 4px 4px 0;
	}
	pre.log-code{
		font-size: 12px;
    	tab-size: 2;
	}

	.nav-menu>li a{
		font-size: 12px;
	}

	.expand{
		right: 8px;
		margin-top: -10px;
		position: absolute;
	}

	.expand .mdi{
		font-size: 24px;
	}

	.expand-text{
		padding: 4px 6px;
		margin-right: 24px;
		border-radius: 6px;

		-webkit-transition: 0.4s;
		-o-transition: 0.4s;
		transition: 0.4s;
	}

	.expand-text:hover{
		background-color: #EEE;
	}

	.table{
		max-width: 992px !important;
	}
</style>
</head>
<body>
	<a href="#" class="mobile-menu">
		<i class="mdi mdi-menu"></i>
		<span>MENU</span>
	</a>

	<div class="main-menu">
		<div class="logo">
			<a class="nav-logo" href="{{ url('/') }}">
				<img src="{{ URL::asset('public/images/favicon.png') }}" alt="" class="small-logo" width="35" height="35" style="margin-top: -4px;">
				<span class="color">Pixel</span><span>Pay</span>
			</a>
		</div>
		<ul class="nav-menu">
			@foreach($files as $file)
			<li class="@if ($current_file == $file) active @endif">
				<a href="?l={{ base64_encode($file) }}">
					{{-- <i class="mdi mdi-chart-bar"></i>  --}}
					{{$file}}
				</a>
			</li>
			@endforeach
		</ul>

	</div>
	<div class="content">
		<div class="admin-content">
			<div class="container">
				<div class="header">
					<div class="scoreboard">
						<div class="score">
							<span class="score-description">Administrar</span>
							<span class="score-label">Registros</span>
						</div>
					</div>

					<div class="clearfix"></div>
				</div>

				@if ($logs === null)
				<div>
					Log file >50M, please download it.
				</div>
				@else
				<div class="float-right action-buttons">
					@if($current_file)
					<a href="?dl={{ base64_encode($current_file) }}" class="dt-button">
						<span class="mdi mdi-download"></span>
						Download file
					</a>
					<a id="delete-log" href="?del={{ base64_encode($current_file) }}"  class="dt-button">
						<span class="mdi mdi-minus-circle"></span> Delete file
					</a>
					@if(count($files) > 1)
					<a id="delete-all-log" href="?delall=true" class="dt-button">
						<span class="mdi mdi-arrange-bring-forward"></span> Delete all files
					</a>
					@endif
					@endif
					</div>
				</div>

				<table id="table-log" class="table table-hover">
					<thead>
						<tr>
							<th width="20" style="display: none">Date</th>
							<th width="30">Details</th>
							<th>Content</th>
						</tr>
					</thead>
					<tbody>

						@foreach($logs as $key => $log)
						<tr>
							<td style="display: none">{{{$log['date']}}}</td>
							<td class="date">
								<span class="badge badge-default">{{{ Carbon\Carbon::parse($log['date'])->format('h:m:s a') }}}</span><br>
								{{$log['context']}} - <span class="text-{{{$log['level_class']}}}">{{$log['level']}}</span>
							</td>
							<td class="log-content">
								@if ($log['stack']) 
									<a class="expand" onclick="$('#stack-{{{$key}}}').slideToggle()">
										<span class="mdi mdi-stackoverflow text-warning"></span>
									</a>
									<div class="expand-text" onclick="$('#stack-{{{$key}}}').slideToggle()">{{{$log['text']}}}</div>
								@else
									<div class="expand">
										<span class="mdi mdi-information text-primary"></span>
									</div>
									{{{$log['text']}}}
								@endif


								@if (isset($log['in_file'])) 
									<br/>
									{{{$log['in_file']}}}
								@endif

								@if ($log['stack'])
									<div class="stack" id="stack-{{{$key}}}" style="display: none">{{{ trim($log['stack']) }}}</div>
								@endif
							</td>
						</tr>
						@endforeach

					</tbody>
				</table>
				@endif
			</div>
		</div>
	</div>

	<script src="{{ URL::asset('public/js/admin-vendor.js') }}"></script>
	<script src="{{ URL::asset('public/js/admin-combined.js') }}"></script>
	<script src="{{ URL::asset('public/js/messages.js') }}"></script>
	{{-- <script src="{{ URL::asset('public/js/admin.js') }}"></script> --}}

	<script>
		$(document).ready(function () {
			$('#table-log').DataTable({
				"order": [0, 'desc'],
				"stateSave": true,
				"autoWidth": false,
				buttons: [],
				dom: "<f>" +
					"<'card table-responsive'tr>" +
					"<p><B><i>",
				drawCallback: function(){
					$('.log-content').each(function(index, el) {
						if(isJson($(this).text()))
							$(this).html('<pre class="log-code">' + JSON.stringify(JSON.parse($(this).text()), null, "\t") + '</pre>')
						else
							$(this).html($(this).html().trim())
					});

					$('.stack').each(function(index, el) {
						if(isJson($(this).text()))
							$(this).html('<pre class="log-code">' + JSON.stringify(JSON.parse($(this).text()), null, "\t") + '</pre>')
						else
							$(this).html($(this).html().trim())
					});
				},
				"stateSaveCallback": function (settings, data) {
					window.localStorage.setItem("datatable", JSON.stringify(data));
				},
				"stateLoadCallback": function (settings) {
					var data = JSON.parse(window.localStorage.getItem("datatable"));
					if (data) data.start = 0;
					return data;
				},
				language: {
					emptyTable:     '<div class="no-content"><img src="{{ URL::asset('public/images/icons/bug-icon.svg') }}" width="100" height="100" alt=""><h3>{{ __('admin.no_items') }}</h3></div>',
					info:           '{{ __('frontend.datatable_info') }}',
					infoEmpty:      '{{ __('frontend.datatable_info_empty') }}',
					infoFiltered:   '{{ __('frontend.datatable_info_filtered') }}',
					lengthMenu:     '{{ __('frontend.datatable_menu') }}',
					loadingRecords: '',
					processing:     '',
					search:         "",
					zeroRecords:    '<div class="no-content"><img src="{{ URL::asset('public/images/icons/bug-icon.svg') }}" width="100" height="100" alt=""><h3>{{ __('admin.datatable.no_records') }}</h3></div>',
					paginate: {
						first: '&laquo;',
						last: '&raquo;',
						next: '&raquo;',
						previous: '&laquo;',
					}
				}
			});

			$('#delete-log, #delete-all-log').click(function () {
				return confirm('Are you sure?');
			});

			// $('[data-display]').click(function(event) {
			// 	if($(this).data('stacked')){
			// 		$('#' + $(this).data('display')).hide();
			// 		$(this).data('stacked', false);
			// 	}else{
			// 		$('#' + $(this).data('display')).fadeIn();
			// 		$(this).data('stacked', true);
			// 	}
			// });
		});



		function isJson(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}
	</script>
</body>
</html>
@endif