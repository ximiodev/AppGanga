var apiStatus = false;
var isLoginSave = false;
var isLogin = false;
var userLogId = false;
var primeraVez = false;

var app = {
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.testApi();
        var isapp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
		if ( isapp ) {
			app.setupPush();
		}
        isLoginSave = localStorage.getItem('isLogin');
        userLogId = localStorage.getItem('userLogId');
        if(!userLogId) {
			userLogId  = '';
		}
        primeraVez = localStorage.getItem('primeraVez');
        if(!primeraVez) {
			localStorage.setItem('primeraVez', "true");
			primeraVez = 'true';
		} else {
			localStorage.setItem('primeraVez', "false");
			primeraVez = 'false';
		}
		
        if(isLoginSave=="true") {
			//usuario logueado
		} else {
			//usuario no logueado
		}
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    },
	testApi: function() {
		this.callApi('testApi', {}, inciarApi)
	},
	callApi: function(metodo, datos={}, returnFunt=dummyFunc) {
		datos.action = metodo;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'http://www.gangahoteles.com/appserv/apiganga.php',
			data: datos,
			success: function (data) {
				returnFunt(data)
			}
		});
	}
};

function dummyFunc(datos) {
	return true;
}

function inciarApi(datos) {
	if(datos.res) {
		apiStatus = true;
		console.log('api ok');
	} else  {
		apiStatus = false;
		console.log('api no');
	}
}

function validateEmail(emailval) {
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(emailval.match(mailformat)) {
		return true;
	} else 	{
		return false;
	}
}
