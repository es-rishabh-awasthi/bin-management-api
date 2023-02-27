module.exports = (sequelize, Sequelize) => {

    const tbl_addom_empresa = sequelize.define("addom_empresa", {
        empresa_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        empresa_nom: {
            type: Sequelize.STRING
        },
        empresa_servicio_ini:
        {
            type: Sequelize.STRING
        },
        empresa_servicio_fin: {
            type: Sequelize.STRING
        },

        empresa_contacto: {
            type: Sequelize.STRING
        },
        empresa_email: {
            type: Sequelize.STRING
        },
        empresa_tel: {
            type: Sequelize.STRING
        },

        empresa_logo: {
            type: Sequelize.STRING
        },


        empresa_coment: {
            type: Sequelize.STRING
        },


        empresa_activo: {
            type: Sequelize.STRING
        },

        empresa_es_cliente: {
            type: Sequelize.STRING
        },



        cliente_id: {
            type: Sequelize.STRING
        },
        idioma_id: {
            type: Sequelize.STRING
        }, empresa_global: {
            type: Sequelize.STRING
        },
    }
    );
    return tbl_addom_empresa;
};