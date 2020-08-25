var tipoBus = 0;
var base = 'http://www.gangahoteles.com/';
var APIurl = 'http://www.gangahoteles.com/appserv/apiganga.php';
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var userinfo = {};

function disableFib() {
    //$( "#lugar2" )[0].autocomplete = isChrome ? 'disabled' :  'nope';
    //$( "#lugar" ).attr("autocomplete", (isChrome ? 'disabled' :  'nope'));
}

$(document).ready(function () {
	$('.ventana.activa').removeClass('activa');
	$('#pantalla_home').addClass('activa');
	$(document).on('click', '.btnBotonera, .linktopvolver, .linkderecho, .linkcomun, .itemMenuTop', function (e) {
		e.preventDefault();
		ponerVentana($(this).attr('data-link'));
	});
	
	$(document).on('click', '#btnBuscarEstadia, #btnBuscarMicroEstadia',function (e) {
		e.preventDefault();
		ponerVentana('pantalla_resultados');
	});
	
	$('#formEstadia').disableAutoFill();
	$('#formMicroestadia').disableAutoFill();
	$('#formEstadia').on('submit', function(e) {
		$('#formEstadia input').each(function(e) {
			$(this).attr('name', $(this).attr('id'))
		});
	});
	$('#formMicroestadia').on('submit', function(e) {
		$('#formMicroestadia input').each(function(e) {
			$(this).attr('name', $(this).attr('id'))
		});
	});

	$('.selectorTipo .selectotrGanga').click(function(e) {
		e.preventDefault();
		if(tipoBus==1) {
			$('.selectotrGanga').addClass('activo');
			$('#formmicroestadia').removeClass('hidden');
			$('#formestadia').addClass('hidden');
			tipoBus = 0;
		} else {
			$('.selectotrGanga').removeClass('activo');
			$('#formestadia').removeClass('hidden');
			$('#formmicroestadia').addClass('hidden');
			tipoBus = 1;
		}
	});

	$('.selectotrGanga').click(function(e) {
		e.preventDefault();
		if(!$(this).hasClass('activo')) {
			$(this).addClass('activo');
		} else {
			$(this).removeClass('activo');
		}
	});
	
	$('#btnLoginP').click(function(e) {
		e.preventDefault();
		var email = $('#emaillogin').val();
		var pass = $('#passlogin').val();
		if(email!="" && pass!="" && validateEmail(email)){
			var datos = {}
			datos.email = email;
			datos.pass = pass;
			app.callApi('login', datos, putUserinfo);
		} else {
			alerta("Login", "Debes completar ambos campos");
		}
	});
	
	$('#btnRegisP').click(function(e) {
		e.preventDefault();
		var nombre = $('#nombrereg').val();
		var apellido = $('#apellidoreg').val();
		var email = $('#emailreg').val();
		var pass = $('#passreg').val();
		var pass2 = $('#passreg2').val();
		if(nombre!="" && apellido!="" && email!="" && pass!="" && pass==pass2 && validateEmail(email)){
			var datos = {}
			datos.sincapcha = 1;
			datos.origen = "regapp";
			datos.nombre = nombre;
			datos.apellido = apellido;
			datos.email = email;
			datos.pass = pass;
			app.callApi('register', datos, backToregister);
		} else {
			alerta("Login", "Debes completar todos campos");
		}
	});
	
	$('.btnCerrarSession').click(function(e) {
		e.preventDefault();
		isLoginSave = false;
		localStorage.setItem('isLogin', isLoginSave);
		userLogId = false;
		userinfo = {};
		localStorage.setItem('userLogId', userLogId);
		sacarPerfil();
		sacarFavoritos();
		$('.userblock').append('<a href="#" class="linkMenu linkcomun" data-link="pantalla_login"><i class="gangaicons-user-circular"></i> Login</a>');
		
		ponerVentana('pantalla_home');
	});
	
	$('#btnRecuperarPassP').click(function(e) {
		e.preventDefault();
		var email = $('#emailrecupera').val();
		if(email!="" && validateEmail(email)){
			var datos = {}
			datos.email = email;
			app.callApi('recoverPass', datos, putRecoverPassS);
		} else {
			alerta("Login", "Debes ingresar tu email.");
		}
	});
	
	setInterval(disableFib, 100);
	
    $( "#lugar" ).autocomplete({
		source: base+"ajax/getCities.php",
		minLength: 2,
		select: function( event, ui ) {
			$( "#lugar_v" ).val( ui.item.value );
		},
    });
	
    $( "#lugar2" ).autocomplete({
      source: base+"ajax/getCities.php",
      minLength: 2,
		select: function( event, ui ) {
			$( "#lugar_v2" ).val( ui.item.value );
		},
    });
    
    
	$('#llegada').daterangepicker({
		singleDatePicker: true,
		autoUpdateInput : false,
		singleClasses: "picker_3",
		timePicker: false,
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(chosen_date) {
		$('#llegada').val(chosen_date.format('YYYY-MM-DD'));
	});
	
    
    
	$('#salida').daterangepicker({
		singleDatePicker: true,
		autoUpdateInput : false,
		singleClasses: "picker_3",
		timePicker: false,
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(chosen_date) {
		$('#salida').val(chosen_date.format('YYYY-MM-DD'));
	});
    
    
	$('#llegada2').daterangepicker({
		singleDatePicker: true,
		autoUpdateInput : false,
		singleClasses: "picker_3",
		timePicker: true,
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(chosen_date) {
		$('#llegada2').val(chosen_date.format('YYYY-MM-DD'));
	});
    
	$('#nuevalarma').daterangepicker({
		singleDatePicker: true,
		autoUpdateInput : false,
		singleClasses: "picker_3",
		timePicker: true,
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(chosen_date) {
		$('#nuevalarma').val(chosen_date.format('YYYY-MM-DD'));
	});
		
	$('.selectorGanga').on('click', function(e){
		e.preventDefault();
		$('.carrHabitaciones .item').removeClass('activo');
		$('.cajainfoHabit').removeClass('activaHab');
		$(this).closest('.cajainfoHabit').addClass('activaHab');
		$(this).closest('.item').addClass('activo');
		var datos = {
			camas: $(this).closest('.cajainfoHabit').data('camas'),
			precio: $(this).closest('.cajainfoHabit').data('precio')
		};
		
		$('input[type=checkbox][name=selectedRoom]').attr('checked', false);
		$(this).find('input').attr('checked', true);
		console.log($(this).find('input').attr('id'))
	  });
	 
	
	
	$('.carrHoteles').owlCarousel({
		loop:true,
		margin:10,
		navText: ['<i class="fa fa-chevron-left" >','<i class="fa fa-chevron-right">'],
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:true
			},
			600:{
				items:2,
				nav:false
			},
			1000:{
				items:4,
				nav:true
			}
		}
	})
	
	$('.carrHabitaciones').owlCarousel({
		loop:true,
		margin:10,
		navText: ['<i class="fa fa-chevron-left" >','<i class="fa fa-chevron-right">'],
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:true
			},
			600:{
				items:2,
				nav:false
			},
			1000:{
				items:4,
				nav:true
			}
		}
	})
	
	$('.carrCiudades').owlCarousel({
		loop:true,
		margin:10,
		navText: ['<i class="fa fa-chevron-left" >','<i class="fa fa-chevron-right">'],
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:true
			},
			600:{
				items:2,
				nav:false
			},
			1000:{
				items:4,
				nav:true
			}
		}
	})
});

function alerta(titulo="Error", mensaje, tipoalerta='danger') {
	$('#modalErrorTitle').html(titulo);
	$('#modalErrorText').html('<div class="alert alert-'+tipoalerta+'">'+mensaje+'</div>');
	$('#modalError').modal("show");
}


function backToregister(datos) {
	if(datos.res) {
		alerta("Registro", datos.message, 'warning');
		ponerVentana('pantalla_home');
	} else {
		alerta("Registro error", datos.message);
	}
}


function putUserinfo(datos) {
	if(datos.res) {
		$('.userblock').html('');
		$('.userblock').append('<h1>Hola '+datos.userifo.nombre+'!</h1>');
		
		isLoginSave = true
		localStorage.setItem('isLogin', isLoginSave);
		userLogId = datos.userifo.ID;
		userinfo = datos.userifo;
		localStorage.setItem('userLogId', userLogId);
		
		$('.notlogedcont').hide();
		ponerVentana('pantalla_home');
		
		ponerFavoritos();
		ponerPerfil();
	} else {
		alerta("Login error", datos.message);
	}
}

function ponerVentana(donde) {
	$('.ventana.activa').removeClass('activa');
	$('#'+donde).addClass('activa');
}

function ponerFavoritos() {
	$('.notlogedcont').hide();
	$('#pantalla_favoritos .contenidoseccion').html('No tienes favoritos.');
}

function ponerPerfil() {
	$('.notlogedcont').hide();
	$('#pantalla_perfil .contenidoseccion').html(JSON.stringify(userinfo));
}

function  sacarFavoritos() {
	$('.notlogedcont').show();
	$('#pantalla_favoritos .contenidoseccion').html('');
}

function sacarPerfil() {
	$('.notlogedcont').show();
	$('#pantalla_perfil .contenidoseccion').html('');
}

function putRecoverPassS(resultado) {
	tipo = (resultado.res)?'warning':'danger';
	alerta("Recuperar contraseña", resultado.message, tipo);
	ponerVentana('pantalla_home');
}
