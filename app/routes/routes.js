const express = require("express");
const app = express();
const { authJwt } = require("../middleware");

const sidetainerCtl = require("../controllers/sidetainer.controller");
const eventCtl = require("../controllers/event.controller");
const logCtl = require("../controllers/log.controller");
const citizenCtl = require("../controllers/citizen.controller");
const userCtl = require("../controllers/user.controller");
const addomAlarmaCtl = require("../controllers/addom_alarma.controller");
const bigtainerStatusCtl = require("../controllers/bigtainerStatus.controller");
const bigtainerElementCtl = require("../controllers/bigtainer.controller");
const sidetainerElementCtl = require("../controllers/sidetainer.controller");
const containerCtl = require("../controllers/element.controller");
// const webVitalsAdminCtl = require("../controllers/web-vitals/admin.controller");
// const websiteCtl = require("../controllers/web-vitals/website.controller");
// const contentCtl = require("../controllers/web-vitals/content.controller");
// const mockupCtrl=require("../controllers/intake-form/mockup.controler");
// const wordpressCtrl=require("../controllers/intake-form/wordPressCtrl");
// const hubSpotCrl=require("../controllers/intake-form/hubSpotCtrl")
// const stripeCtrl=require("../controllers/intake-form/stripeCtrl")
// const apiKey=require("../controllers/orbit-local/apiKeyIntegrate")

module.exports = function (app) {
  // app.use("/bigtainer", bigtainerStatusCtl);
  app.use("/container", containerCtl);
  app.use("/bigtainer", bigtainerElementCtl);
  app.use("/sidetainer", sidetainerElementCtl);
  app.use("/alarm", addomAlarmaCtl);
  app.use("/log", logCtl);
  app.use("/event", eventCtl);
  app.use("/citizen", citizenCtl);
  app.use("/user", userCtl);
  app.use("/icon", express.static("public/icon"));
  app.use("/logo", express.static("public/logo"));
  app.use("/favi", express.static("public/favicon"));
  app.use("/profile", express.static("public/profile"));
  app.use("/blogImage", express.static("public/blogImage"));

  app.use("/images", express.static("public/blogData"));
  app.use("/brand", express.static("public/brandlogo"));
  app.use("/public", express.static("public"));


};
