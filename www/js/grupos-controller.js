/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var c = c || {};
var GrupoLi = '<li ><a href="#pgEditarGrupo?Title=LINK">ID</a></li>';
var GrupoHdr = '<li data-role="list-divider">Grupo</li>';
var noGrupo = '<li id="noNote">No hay grupos disponibles</li>';


c.GruposController = function () {
   
    //definir las variables
    this.$grupos = null;
    this.$gruposSalir = null;
    this.$pageSignIn = null;
    this.$btnCargarGrupos = null;
};
c.GruposController.prototype.init = function () {
    //asociar las variables a los html
    this.$grupos = $("#listaGrupos");
    this.$gruposSalir = $("#grupo-salir", this.$grupos);
    
    this.$pageSignIn = "#page-signin";
    //this.$btnCargarGrupos = $("#btn-cargar-dispositivos", this.$grupos);
};

c.GruposController.prototype.cerrarSession = function () {
    var me = this;
    c.Session.deleteInstance();
    $.mobile.navigate(me.$pageSignIn);
};

c.GruposController.prototype.cargarGrupos = function (usuario) {
    var url = c.Settings.gruposUrl.replace("{correo}", usuario.correo);
        
    $.ajax({
        url: url,
        type: c.Settings.TYPE_GET,
        dataType: c.Settings.DATA_TYPE_JSON,
        contentType: c.Settings.APPLICATION_JSON,
        success: function (resp) {
            
        var html = '';    
            for (var n = 0; n < resp.length; n++)
            {
                var grupo = JSON.parse(resp[n]);
                var nombreGrupo = grupo.nombre;
                
                var nLnk = nombreGrupo.replace(/-/g,' ');
                var id = grupo.gruposPK.id;
                html += GrupoLi.replace(/ID/g,nLnk).replace(/LINK/g,id);

            }
            
            $('#listaGrupos').html(GrupoHdr + html).listview('refresh');

          
        },
        error: function (e) {
            var mensaje = message(e);
            if (mensaje == null) {
                console.log("error al cargar grupos.")
            } else {
                console.log(mensaje);
            }
        }
    });
    
    
}



