module.exports = (sequelize, Sequelize) => {
    /* SELECT `cliente_id`, `cliente_nom`, `cliente_servicio_ini`, `cliente_servicio_fin`, `cliente_contacto`, `cliente_email`, `cliente_tel`, `cliente_logo`, `cliente_abr`, `idioma_id`, `cliente_coment`, `cliente_activo`, `cliente_global`, `cliente_zona_horaria`, `cliente_ciudad` FROM `addom_cliente` WHERE 1
 */
    const tbl_citizen = sequelize.define("mod_ciudadano", {
        cliente_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        cliente_nom:
        {
            type: Sequelize.STRING
        },
        cliente_servicio_ini: {
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