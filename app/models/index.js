const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  timestamps: false,
  logging:false,
  define: {
    timestamps: true,
    freezeTableName: true,createdAt: false,
    updatedAt: false,
  },
  operatorsAliases: 0,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tbl_addom_alarma = require("../models/sidetainer.model.js")(
  sequelize,
  Sequelize
);

db.tbl_addom_alarma_mail = require("../models/addom_alarma_mail.model.js")(
  sequelize,
  Sequelize
);

db.tbl_event = require("../models/event.model.js")(
  sequelize,
  Sequelize
);

db.tbl_log = require("../models/log.model.js")(
  sequelize,
  Sequelize
);

db.tbl_citizen = require("../models/citizen.model.js")(
  sequelize,
  Sequelize
);

db.tbl_addom_usuario = require("../models/user.model.js")(
  sequelize,
  Sequelize
);

db.tbl_bigtainer_status_view = require("../models/bigtainerStatus.model.js")(
  sequelize,
  Sequelize
);

db.tbl_bigtainer_element = require("../models/bigtainer-element.model.js")(
  sequelize,
  Sequelize
);

db.tbl_sidetainer_element = require("../models/sidetainer-element.model.js")(
  sequelize,
  Sequelize
);

db.tbl_addom_elemento = require("../models/element.model.js")(
  sequelize,
  Sequelize
);


/*
db.admin = require("../../models/web-vitals/admin.model.js")(
  sequelize,
  Sequelize
);
*/
db.tbl_event.belongsTo(db.tbl_log);
// db.tbl_log.belongsTo(db.tbl_event);
module.exports = db;
