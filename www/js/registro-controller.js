var c = c || {};

c.RegistroController = function () {
    this.$registro = null;
    this.$pageSignIn = null;
    this.$inputCorreo = null;
    this.$inputSerial = null;
    this.$inputClave = null;
    this.$inputClaveVerificada = null;
    this.$btnCrearRegistro = null;
};

c.RegistroController.prototype.init = function () {
    this.$registro = $("#registro");
    this.$pageSignIn = "#page-signin";
    this.$inputCorreo = $("#input-correo", this.$registro);
    this.$inputSerial = $("#input-serial", this.$registro);
    this.$inputClave = $("#input-clave", this.$registro);
    this.$inputClaveVerificada = $("#input-clave-verificada", this.$registro);
    this.$btnCrearRegistro = $("#btn-crear-registro", this.$registro);
};

c.RegistroController.prototype.registrarUsuario = function () {

    var camposRequeridos = false;

    this.$inputCorreo.removeClass(c.Estilos.INVALID_INPUT_STYLE);
    this.$inputSerial.removeClass(c.Estilos.INVALID_INPUT_STYLE);
    this.$inputClave.removeClass(c.Estilos.INVALID_INPUT_STYLE);
    this.$inputClaveVerificada.removeClass(c.Estilos.INVALID_INPUT_STYLE);

    if (this.$inputCorreo.val().length === 0) {
        this.$inputCorreo.addClass(c.Estilos.INVALID_INPUT_STYLE);
        camposRequeridos = true;
    }
    if (this.$inputSerial.val().length === 0) {
        this.$inputSerial.addClass(c.Estilos.INVALID_INPUT_STYLE);
        camposRequeridos = true;
    }
    if (this.$inputClave.val().length === 0) {
        this.$inputClave.addClass(c.Estilos.INVALID_INPUT_STYLE);
        camposRequeridos = true;
    }
    if (this.$inputClaveVerificada.val().length === 0) {
        this.$inputClaveVerificada.addClass(c.Estilos.INVALID_INPUT_STYLE);
        camposRequeridos = true;
    }
    if (camposRequeridos) {
        mensajeAlerta('Registro Usuario','Valida los campos requeridos');
        return;
    }
    if (this.$inputClave.val() != this.$inputClaveVerificada.val()) {
        mensajeAlerta('Registro Usuario','Valida que las claves sean iguales');
        return;
    }


};