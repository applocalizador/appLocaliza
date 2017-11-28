var c = c || {};
var m;

c.DispositivosController = function () {
    this.$dispositivos = null;
    this.$dispositivosSalir = null;
    this.$pageSignIn = null;
    this.$btnCargarDispositivos = null;
    this.selectDispositivos = null;
};
c.DispositivosController.prototype.init = function () {
    this.$dispositivos = $("#dispositivos");
    this.$dispositivosSalir = $("#dispositivos-salir", this.$dispositivos);
    this.$pageSignIn = "#page-signin";
    this.$btnCargarDispositivos = $("#btn-cargar-dispositivos", this.$dispositivos);
    this.selectDispositivos = $("#select-dispositivos", this.$dispositivos);
};

c.DispositivosController.prototype.cargarListaDispositivos = function (usuario) {
//    if ($('#epsUsuario').has('option').length <= 1) { selectDispositivos
    var url = c.Settings.dispositivosUsuarioUrl.replace("{correo}", usuario.correo);
    $.ajax({
        url: url,
        type: c.Settings.TYPE_GET,
        dataType: c.Settings.DATA_TYPE_JSON,
        contentType: c.Settings.APPLICATION_JSON,
        success: function (resp) {
            for (var n = 0; n < resp.length; n++)
            {
                var object = JSON.parse(resp[n]);
                var latLng = object.localizacionesDispositivo.latitude + '|' + object.localizacionesDispositivo.longitud;
//                var latLng = new google.maps.LatLng(object.localizacionesDispositivo.latitude, object.localizacionesDispositivo.longitud);
                $("#select-dispositivos").append($('<option>', {
                    value: latLng,
                    text: object.identificador
                }));
            }
            $("#select-dispositivos").selectmenu('refresh');
        },
        error: function (e) {
            var mensaje = message(e);
            if (mensaje == null) {
                console.log("error al cargar clientes.")
            } else {
                console.log(mensaje);
            }
        }
    });
//    }
};

c.DispositivosController.prototype.cerrarSession = function () {
    var me = this;
    c.Session.deleteInstance();
    $.mobile.navigate(me.$pageSignIn);
};

c.DispositivosController.prototype.cargarMapaDispositivos = function () {
//    var latlng = new google.maps.LatLng(4.807259, -75.744327);
    var latlngCadena = $("#select-dispositivos").val();
    var lat = parseFloat(latlngCadena.split("|")[0]);
    var lng = parseFloat(latlngCadena.split("|")[1]);
    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
        zoom: 13,
        center: latlng,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapa = m;
    if (mapa == null || mapa === null) {
        mapa = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    }

    var marker = new google.maps.Marker({
        position: latlng,
        map: mapa,
        title: "Mi posición",
        animation: google.maps.Animation.DROP});
};

c.DispositivosController.prototype.cargarMapaDispositivo = function () {
//    var defaultPos = new google.maps.LatLng(4.807259, -75.744327);
    var defaultPos = new google.maps.LatLng(4.812132, -75.706377);
//    MuestraMapa(defaultPos);//temporal
    function esperarGps() {
        cordova.plugins.diagnostic.isLocationEnabled(
                function (enabled) {
                    if (enabled) {
                        validarGps();
                    } else {
                        esperarGps();
                    }
                }, function (error) {
            console.error("Error: " + error);
        });
    }
    function opcionesNoGps(buttonIndex) {
        if (buttonIndex == 1) {
            MuestraMapa(defaultPos);
        }
        if (buttonIndex == 2) {
            cordova.plugins.diagnostic.switchToLocationSettings();
            esperarGps();
        }
    }
    function validarGps() {
        if (navigator.geolocation) {
            function exito(pos) {
                MuestraMapa(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }
            function falla(error) {
                navigator.notification.confirm(
                        'Por favor activar el GPS para localizar el dispositivo actual. \nSi lo prefiere puede ver los dipositivos asociados. ', // message
                        opcionesNoGps, // callback to invoke
                        'GPS Inactivo', // title
                        ['Mostrar Dispositivos Registrados', 'Activar GPS']             // buttonLabels
                        );
            }
            //maximumAge- Guarda la posicion por 5 minutos 
            //enableHighAccuracy: Se tratan de obtener los mejores resultados posible del GPS
            //timeout: el tiempo maximo que se espera para obtener la posicion en este caso 5 segundos
            var options = {maximumAge: 500000, enableHighAccuracy: true, timeout: 10000};
            navigator.geolocation.getCurrentPosition(exito, falla, options);
        }//FIN IF
        else {
            MuestraMapa(defaultPos);  // No soporta geolocalizacion y dibuja el mapa en posicion Default
        }

    }
    //FUNCION DIBUJAR MAPa
    function MuestraMapa(latlng) {

        var myOptions = {
            zoom: 13,
            center: latlng,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

//        var infowindow = new google.maps.InfoWindow({position: latlng, content: '<p>Mi posición</p>' + latlng});
//        var infowindowCaf = new google.maps.InfoWindow({position: latlng, content: '<p>Dispositivo actual</p>'});
        var geocoder = new google.maps.Geocoder;

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Mi posición",
            animation: google.maps.Animation.DROP});

//        localStorage.setItem('ciudad', '');
//        obtenerCiudad(geocoder, latlng, map);

        function obtenerCiudad(geocoder, latlng, map) {
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results) {
                        //alert('1 '+results[1].formatted_address);

                        var result = results[1];
                        var city = "";
                        for (var i = 0, len = result.address_components.length; i < len; i++) {
                            var ac = result.address_components[i];
                            if (ac.types.indexOf('locality') >= 0)
                                city = ac.long_name;
                        }
                    } else {
                        window.alert('No se encontró la ciudad');
                    }
                } else {
                    window.alert('Se generó un error: ' + status);
                }
            });
        }
        m = map;
    }
    validarGps();
};
