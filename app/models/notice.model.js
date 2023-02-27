module.exports = (sequelize, Sequelize) => {
    const tbl_log = sequelize.define("logs", {
        id :  {
            type: Sequelize.INTEGER , primaryKey: true
        },
  event_id:  {
            type: Sequelize.STRING
        },
  automatic:  {
            type: Sequelize.STRING
        },
  top_down:  {
            type: Sequelize.STRING
        },
  top_up:  {
            type: Sequelize.STRING
        },
  platform_down1:  {
            type: Sequelize.STRING
        },
  platform_upload:  {
            type: Sequelize.STRING
        },
  platform_up:  {
            type: Sequelize.STRING
        },
  lid_closed:  {
            type: Sequelize.STRING
        },
  fumes:  {
            type: Sequelize.STRING
        },
  platform_down:  {
            type: Sequelize.STRING
        },
  open_mailbox:  {
            type: Sequelize.STRING
        },
  mailbox_closed:  {
            type: Sequelize.STRING
        },
  door_open:  {
            type: Sequelize.STRING
        },
  door_close:  {
            type: Sequelize.STRING
        },
  shared_mark :  {
            type: Sequelize.STRING
        }}
  );
    return tbl_log;
};