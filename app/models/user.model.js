module.exports = (sequelize, Sequelize) => {
    /* */
    const tbl_addom_usuario = sequelize.define("addom_usuario", {
        usuario_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        empresa_id: {
            type: Sequelize.STRING
        },
        idioma_id:
        {
            type: Sequelize.STRING
        },
        usuario_nom: {
            type: Sequelize.STRING
        },
        usuario_usu: {
            type: Sequelize.STRING
        },
        usuario_cla: {
            type: Sequelize.STRING
        },
        usuario_mail: {
            type: Sequelize.STRING
        },
        usuario_tel: {
            type: Sequelize.STRING
        },
        usuario_codigo: {
            type: Sequelize.STRING
        },
        usuario_tarjeta: {
            type: Sequelize.STRING
        },
        usuario_activo: {
            type: Sequelize.STRING
        },
        usuario_sesion: {
            type: Sequelize.STRING
        },
        usuario_ip: {
            type: Sequelize.STRING
        },
        usuario_acceso: {
            type: Sequelize.STRING
        },
        usuario_conectado: {
            type: Sequelize.STRING
        },
        usuario_remote: {
            type: Sequelize.STRING
        }
        /*
  observacion ,
  usuario_alta_nom
  usuario_mod_nom
  codigo_administracion_electronica ,
  ciudadano_id_padre ,
  referencia_id ,
  cod_empresa ,
  terminal_id ,
  marca,
  isla
  */     }
    );
    return tbl_addom_usuario;
};