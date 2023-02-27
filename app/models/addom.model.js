module.exports = (sequelize, Sequelize) => {
    const tbl_event = sequelize.define("tbl_addom", {
        id:  {
            type: Sequelize.INTEGER,   primaryKey: true
        }, 
  device_id: {
            type: Sequelize.STRING
        }  ,
  code:  {
            type: Sequelize.STRING
        }, 
  name :  {
            type: Sequelize.STRING
        },
  sense :  {
            type: Sequelize.STRING
        },
  state :  {
            type: Sequelize.STRING
        },
  time :  {
            type: Sequelize.STRING
        }}
  );
    return tbl_event;
};