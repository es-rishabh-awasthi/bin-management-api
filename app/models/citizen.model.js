module.exports = (sequelize, Sequelize) => {
    /* `` (
  `ciudadano_id` ,
  `cliente_id` ,
  `codigo_ciudadano`
  `codigo_administrativo` 
  `codigo` 
  `tarjeta`
  `residuo`,
  `tipo`,
  `tipo_usu` ,
  `foraneo` ,
  `propietario`,
  `nombre`
  `nif`
  `email`
  `telefono` ,
  `idioma_id` ,
  `domicilio`
  `codpostal` ,
  `poblacion`
  `saldo` ,
  usuario_alta ,
  fecha_alta ,
  usuario_mod ,
  fecha_mod ,
  baja ,
  fecha_baja ,
  motivo_baja,
  usuario ,
  clave ,
  activo ,
  observacion ,
  usuario_alta_nom
  usuario_mod_nom
  codigo_administracion_electronica ,
  ciudadano_id_padre ,
  referencia_id ,
  cod_empresa ,
  terminal_id ,
  marca,
  isla` */
    const tbl_citizen = sequelize.define("mod_ciudadano", {
        ciudadano_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        cliente_id: {
            type: Sequelize.STRING
        },
        codigo_ciudadano:
        {
            type: Sequelize.STRING
        },
        codigo_administrativo: {
            type: Sequelize.STRING
        },
        codigo: {
            type: Sequelize.STRING
        },
        tarjeta: {
            type: Sequelize.STRING
        },
        residuo: {
            type: Sequelize.STRING
        },
        tipo: {
            type: Sequelize.STRING
        },
        tipo_usu: {
            type: Sequelize.STRING
        },
        foraneo: {
            type: Sequelize.STRING
        },
        propietario: {
            type: Sequelize.STRING
        },
        nombre: {
            type: Sequelize.STRING
        },
        nif: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        idioma_id: {
            type: Sequelize.STRING
        },
        domicilio: {
            type: Sequelize.STRING
        },
        codpostal: {
            type: Sequelize.STRING
        },
        poblacion: {
            type: Sequelize.STRING
        },
        saldo: {
            type: Sequelize.STRING
        },
        usuario_alta: {
            type: Sequelize.STRING
        }, fecha_alta: {
            type: Sequelize.STRING
        }, usuario_mod: {
            type: Sequelize.STRING
        }, fecha_mod: {
            type: Sequelize.STRING
        }, baja: {
            type: Sequelize.STRING
        }, fecha_baja: {
            type: Sequelize.STRING
        }, motivo_baja: {
            type: Sequelize.STRING
        }, usuario: {
            type: Sequelize.STRING
        }, clave: {
            type: Sequelize.STRING
        }, activo: {
            type: Sequelize.STRING
        }, motivo_baja: {
            type: Sequelize.STRING
        },
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
  */     observacion: {
            type: Sequelize.STRING
        }, usuario_alta_nom: {
            type: Sequelize.STRING
        }, usuario_mod_nom: {
            type: Sequelize.STRING
        }, codigo_administracion_electronica: {
            type: Sequelize.STRING
        }, ciudadano_id_padre: {
            type: Sequelize.STRING
        }, referencia_id: {
            type: Sequelize.STRING
        }, cod_empresa: {
            type: Sequelize.STRING
        }, terminal_id: {
            type: Sequelize.STRING
        }, marca: {
            type: Sequelize.STRING
        }, isla: {
            type: Sequelize.STRING
        },
    }
    );
    return tbl_citizen;
};