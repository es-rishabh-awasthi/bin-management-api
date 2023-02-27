module.exports = (sequelize, Sequelize) => {
    const tbl_addom_alarma = sequelize.define("addom_alarma", {
        alarma_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        modulo_id: {
            type: Sequelize.STRING
        },
        alarma_num: {
            type: Sequelize.STRING
        },
        alarma_numbit: {
            type: Sequelize.STRING
        },
        alarma_nom0: {
            type: Sequelize.STRING
        },
        alarma_nom1: {
            type: Sequelize.STRING
        },
        alarma_nom2: {
            type: Sequelize.STRING
        },
        alarma_nom3: {
            type: Sequelize.STRING
        },
        alarma_des1: {
            type: Sequelize.STRING
        },
        alarma_des2: {
            type: Sequelize.STRING
        },
        alarma_des3: {
            type: Sequelize.STRING
        },
        alarma_orden: {
            type: Sequelize.STRING
        },
        alarma_activo: {
            type: Sequelize.STRING
        },
        alarma_produce_evento: {
            type: Sequelize.STRING
        },
        alarma_valor0: {
            type: Sequelize.STRING
        },alarma_valor1: {
            type: Sequelize.STRING
        }}
    );
    return tbl_addom_alarma;
};