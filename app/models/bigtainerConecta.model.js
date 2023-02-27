module.exports = (sequelize, Sequelize) => {
    const tbl_bigtainer_view_conecta = sequelize.define("bigtainer_view_conecta", {

        client_id: {
            type: Sequelize.STRING
        }, id: {
            type: Sequelize.INTEGER, primaryKey: true
        },
        codigo: {
            type: Sequelize.STRING
        },
        Coords: {
            type: Sequelize.STRING
        },
        punto: {
            type: Sequelize.STRING
        },
        lleno: {
            type: Sequelize.STRING
        },
        dispositivo_conecta: {
            type: Sequelize.STRING
        },
        conect: {
            type: Sequelize.STRING
        },

        dif: {
            type: Sequelize.STRING
        },
        tag_hn: {
            type: Sequelize.STRING
        },
        tag_dn: {
            type: Sequelize.STRING
        },
        tag_h: {
            type: Sequelize.STRING
        },
        tag_d: {
            type: Sequelize.STRING
        }, hora: {
            type: Sequelize.STRING
        }
    }
    );
    return tbl_bigtainer_view_conecta;
};