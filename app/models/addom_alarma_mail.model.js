module.exports = (sequelize, Sequelize) => {
    const tbl_addom_alarma_mail = sequelize.define("addom_alarma_mail", {
        alarma_mail_id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        cliente_id: {
            type: Sequelize.STRING
        },
        alarma_id: {
            type: Sequelize.STRING
        },
        alarma_mail_norm: {
            type: Sequelize.STRING
        },
        alarma_mail_correo: {
            type: Sequelize.STRING
        },
        alarma_mail_activo: {
            type: Sequelize.STRING
        }}
    );
    return tbl_addom_alarma_mail;
};