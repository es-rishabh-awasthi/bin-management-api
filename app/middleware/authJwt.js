const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/");
const User = db.user;
const Role = db.role;
const Admin = db.admin;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Jwt Token Missing!",
    });
  }
  var tokensite = token.replace("124abcdkamal", ".");
  //console.log(tokensite);
  await jwt.verify(tokensite, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    //console.log(decoded);
    req.userId = decoded.id;
    req.role = decoded.role;
    req.userType = decoded.userType;
  });

  next(); /*
  if (req.userId) {
    let resourceName = req.baseUrl;
    console.log(resourceName);
    let newresourceName = resourceName;
    const resourceData = await db.resources.findOne({
      where: { resourceName: newresourceName },
    });
    console.log(resourceData);
    const dataNew = await db.permissionmangement
      .findAll({
        include: [
          {
            attributes: ["permissionName"],
            model: db.permission,
            as: "tbl_permission",
          },
        ],

        where: {
          roleId: req.role,
          resourceId: resourceData.id,
        },
        attributes: ["permissionId"],
      })
      .then(function (perms) {
        var allow = false;
        //you can do this mapping of methods to permissions before the db call and just get the specific permission you want.
        perms.forEach(function (perm) {
          if (
            req.method == "POST" &&
            perm.tbl_permission.permissionName === "write"
          )
            allow = true;
          else if (
            req.method == "GET" &&
            perm.tbl_permission.permissionName === "read"
          )
            allow = true;
          else if (
            req.method == "PUT" &&
            perm.tbl_permission.permissionName === "update"
          )
            allow = true;
          else if (
            req.method == "DELETE" &&
            perm.tbl_permission.permissionName === "delete"
          )
            allow = true;
        });
        if (allow) next();
        else res.status(403).send({ error: "access denied" });
      }); //handle your reject and catch here
  } else res.status(400).send({ error: "invalid token" });*/
};
//
isAdmin = (req, res, next) => {
  Admin.findByPk(req.userId).then((user) => {
    if (user.adminType === "super") {
      next();
      return;
    }
    res.status(403).send({
      message: "No Token Provide",
    });
  });
};

//admin verify
isUser = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    const roleid = user.roleId;
    Role.findByPk(roleid).then((roles) => {
      if (roles.name === "user") {
        next();
        return;
      }
      res.status(403).send({
        message: "No Token Provide",
      });
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isUser: isUser,
};
module.exports = authJwt;
