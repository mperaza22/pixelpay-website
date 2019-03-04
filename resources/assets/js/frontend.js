jQuery(document).ready(function($) {
	$('a.hash-link').click(function(){
		$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top - 62
		}, 1000);
		return false;
	});

	$('[name="amount"]').maskMoney();

	$('#test-email').submit(function(e){
		e.preventDefault();

		loading(true);

		$.ajax({
			url: $('#test-email').attr('route'),
			dataType: 'json',
			method: 'POST',
			data: $(this).serialize(),
			success : function(json){
				console.log(json);

				if(json.success){
					loading();

					$('.card-form').hide();
					$('.card-done').fadeIn();

					showMessage(json.message, 'success');
				}else{
					loading();
					showMessage(json.message);
				}
			},
			error : function(err){
				loading();
				showMessage(err);
			}      
		});
	});
});

function loading(status){
	if(status){
		$('.card-form').hide();
		$('.card-loading').fadeIn();
	}else{
		$('.card-loading').hide();
		$('.card-form').fadeIn();
	}
}

function showMessage(text, type){
	Snackbar.show({
		text: text,
		actionText: 'OK',
		actionTextColor: '#FFF',
		customClass: type || 'error'
	});
}