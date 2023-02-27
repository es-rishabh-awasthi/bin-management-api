module.exports = (sequelize, Sequelize) => {
    const tbl_bigtainer_view_status = sequelize.define("bigtainer_view_status", {
        id:  {
            type: Sequelize.INTEGER,   primaryKey: true
        }, 
  cliente_id: {
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
   dispositivo_conecta:  {
            type: Sequelize.STRING
        },
        servicio :  {
            type: Sequelize.STRING
        },
        servicio2 :  {
            type: Sequelize.STRING
        },
        llenado :  {
            type: Sequelize.STRING
        },
        status :  {
            type: Sequelize.STRING
        },
        comunica :  {
            type: Sequelize.STRING
        },
        }
  );
    return tbl_bigtainer_view_status;
};