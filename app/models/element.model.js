module.exports = (sequelize, Sequelize) => {

    const tbl_addom_elemento = sequelize.define("addom_elemento", {
        clave: {
            type: Sequelize.STRING,
        },
        id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        modulo_id: {
            type: Sequelize.INTEGER
        }, cliente_id: {
            type: Sequelize.INTEGER
        }, dispositivo_id: {
            type: Sequelize.INTEGER
        },

        codigo: {
            type: Sequelize.STRING
        }
        , latitud: {
            type: Sequelize.STRING
        }, longitud: {
            type: Sequelize.STRING
        }/* SELECT  `punto`, `lleno`, `estado`, `llenado`, `activo` FROM `` */
        , punto: {
            type: Sequelize.INTEGER
        }, lleno: {
            type: Sequelize.STRING
        }, estado: {
            type: Sequelize.STRING
        }, llenado: {
            type: Sequelize.STRING
        }, activo: {
            type: Sequelize.STRING
        }
    }
    );
    return tbl_addom_elemento;
};