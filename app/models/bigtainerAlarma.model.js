module.exports = (sequelize, Sequelize) => {
    const tbl_bigtainer_view_alarma = sequelize.define("bigtainer_view_alarma", {
        id:  {
            type: Sequelize.INTEGER,   primaryKey: true
        }, 
  client_id: {
            type: Sequelize.STRING
        }  ,
  codigo:  {
            type: Sequelize.STRING
        }, 
  Coords :  {
            type: Sequelize.STRING
        },
  punto :  {
            type: Sequelize.STRING
        },
  lleno :  {
            type: Sequelize.STRING
        },
  alarm :  {
            type: Sequelize.STRING
        },
        hora :  {
            type: Sequelize.STRING
        },
        fecha :  {
            type: Sequelize.STRING
        },
        dif :  {
            type: Sequelize.STRING
        },
        indicator :  {
            type: Sequelize.STRING
        },
        tag_hn :  {
            type: Sequelize.STRING
        },
        tag_dn :  {
            type: Sequelize.STRING
        },
        tag_h :  {
            type: Sequelize.STRING
        },
        tag_d :  {
            type: Sequelize.STRING
        }}
  );
    return tbl_bigtainer_view_alarma;
};