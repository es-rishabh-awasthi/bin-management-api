module.exports = (sequelize, Sequelize) => {
    const tbl_addom_cliente = sequelize.define("addom_cliente", {
        
        cliente_id: {
            type: Sequelize.STRING
        },
        cliente_nom: {
            type: Sequelize.STRING
        },
        cliente_servicio_ini: {
            type: Sequelize.STRING
        },
        cliente_servicio_fin: {
            type: Sequelize.STRING
        },
        cliente_contacto: {
            type: Sequelize.STRING
        },
        cliente_email: {
            type: Sequelize.STRING
        },
        cliente_tel: {
            type: Sequelize.STRING
        },
        cliente_logo: {
            type: Sequelize.STRING
        },
        cliente_abr: {
            type: Sequelize.STRING
        },
        idioma_id: {
            type: Sequelize.STRING
        },
        cliente_coment: {
            type: Sequelize.STRING
        },
        cliente_activo: {
            type: Sequelize.STRING
        },
        cliente_global: {
            type: Sequelize.STRING
        },
        cliente_zona_horaria: {
            type: Sequelize.STRING
        },
        cliente_ciudad: {
            type: Sequelize.STRING
        }}
    );
    return tbl_addom_cliente;
};