var express = require("express");
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const imagesUpload = require("../config/imageUplaod").imagesUpload;
require("dotenv").config();
const { decodeToken, decodeRoleId } = require("../config/decodeTokon");
const sequelize = require("sequelize");
const sequelizes = db.sequelize;
/* GET home page. */
router.post("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//user sing-up
router.post("/singup", async (req, res, next) => {
  try {
    const user = await db.admin.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    if (user) {
      res.send({
        status: 208,
      });
      return;
    } else {
      const user = db.admin.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        roleId: req.body.roleId,
        status: 1,
      });
      if (user) {
        return res.status(201).send({
          status: 201,
        });
      } else {
        return res.status(204).send({
          status: 204,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
    });
  }
});

//sign in
router.post("/login", async (req, res) => {
  try {
    const user = await db.admin.findOne({
      where: {
        userName: req.body.userName,
        status: 1,
      },
    });
    if (user) {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.send({
          status: 401,
        });
      } else {
        var token = jwt.sign(
          { id: user.id, roleId: user.roleId },
          config.secret,
          {
            expiresIn: "12d",
          }
        );
        return res.send({
          status: 200,
          token: token,
        });
      }
    } else {
      return res.send({
        status: 404,
      });
    }
  } catch (error) {
    return res.send({
      status: 500,
    });
  }
});
//update
var uploadImage = multer(imagesUpload).single("image");
router.post("/update/:id", uploadImage, async (req, res) => {
  const id = req.params.id;
  try {
    if (req.file) {
      const user = await db.admin.update(
        { profilePic: "images/" + req.file.filename },
        { where: { id: id } }
      );
      if (user == 1) {
        res.send({
          status: 200,
        });
      } else {
        res.send({
          status: 204,
        });
      }
    } else {
      const user = await db.admin.update(
        { password: bcrypt.hashSync(req.body.password, 8) },
        { where: { id: id } }
      );
      if (user) {
        res.send({
          status: 200,
        });
      } else {
        res.send({
          status: 204,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
    });
  }
});

router.get("/getProfile", async (req, res) => {
  try {
    const roleId = decodeRoleId(req, res);
    const id = decodeToken(req, res);
    if (roleId == 1) {
      const user = await db.admin.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        return res.send({
          status: 200,
          data: user,
        });
      } else {
        return res.status(404).send({
          status: 404,
        });
      }
    }
    if (roleId !== 1) {
      const user = await db.user.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        return res.send({
          status: 200,
          data: user,
        });
      } else {
        return res.status(404).send({
          status: 404,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
    });
  }
});

router.post("/changepassword", async (req, res) => {
  try {
    const id = decodeToken(req, res);

    const user = await db.admin.findOne({
      where: {
        id: decoded.id,
      },
    });
    var passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.send({
        status: 401,
        message: "Invalid Current Password",
      });
    }
    const adminpassword = await db.admin.update(
      { password: bcrypt.hashSync(req.body.newPassword, 8) },
      { where: { id: decoded.id } }
    );
    if (adminpassword) {
      return res.send({
        status: 200,
        message: "change succssfully",
      });
    }
    return res.send({
      status: 304,
      message: "Cannot Change Password",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
    });
  }
});

router.get("/changepassword", async (req, res) => {
  try {
    const id = decodeToken(req, res);

    const user = await db.admin.findOne({
      where: {
        id: decoded.id,
      },
    });
    var passwordIsValid = bcrypt.compareSync(
      req.body.currentPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.send({
        status: 401,
        message: "Invalid Current Password",
      });
    }
    const adminpassword = await db.admin.update(
      { password: bcrypt.hashSync(req.body.newPassword, 8) },
      { where: { id: decoded.id } }
    );
    if (adminpassword) {
      return res.send({
        status: 200,
        message: "change succssfully",
      });
    }
    return res.send({
      status: 304,
      message: "Cannot Change Password",
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
    });
  }
});

///dahsboard records
router.post("/gellassets/:page", async (req, res) => {
  try {
    let limit = 10;
    let offset = 0 + (req.params.page - 1) * limit;
    let updateObject = {};
    if (req.body.districtId) {
      updateObject.districtId = req.body.districtId;
    }
    if (req.body.villageId) {
      updateObject.villageId = req.body.villageId;
    }
    if (req.body.panchayatId) {
      updateObject.panchayatId = req.body.panchayatId;
    }
    const role_id = decodeRoleId(req, res);
    if (role_id == 1) {
      if (req.body.subDistricId) {
        updateObject.blockId = req.body.subDistricId;
      }
      const results = await db.assetsTracking.findAll({
        where: updateObject,
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
      const taskAssign = await Promise.all(
        results.map(async (task) => {
          task = task.toJSON();
          task.district = await db.distric.findAll({
            where: { id: task.districtId },
          });
          task.subDistrict = await db.subDistric.findAll({
            where: { id: task.subDistrictId },
          });
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          status: 200,
          data: taskAssign,
        });
      } else {
        return res.send({
          status: 404,
          message: "No Record Found!",
        });
      }
    }
    if (role_id != 1) {
      const id = decodeToken(req, res);
      const users = await db.user.findOne({ where: { id: id } });
      if (users) {
        updateObject.districtId = users.districId;
      }
      const results = await db.assetsTracking.findAll({
        where: updateObject,

        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
      const taskAssign = await Promise.all(
        results.map(async (task) => {
          task = task.toJSON();
          task.district = await db.distric.findAll({
            where: { id: task.districtId },
          });
          task.subDistrict = await db.subDistric.findAll({
            where: { id: task.subDistrictId },
          });
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          status: 200,
          data: taskAssign,
        });
      } else {
        return res.send({
          status: 404,
          message: "No Record Found!",
        });
      }
    }
  } catch (error) {
    return res.send({
      status: 500,
    });
  }
});

router.post("/getallhousehold", async (req, res, next) => {
  try {
    let updateObject = {};
    let countRecords = "";
    if (req.body.districtId) {
      updateObject.districtId = req.body.districtId;
      countRecords = await sequelizes.query(
        'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" and districtId="' +
        req.body.districtId +
        '") as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" and districtId="' +
        req.body.districtId +
        '") as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" and districtId="' +
        req.body.districtId +
        '") as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" and districtId="' +
        req.body.districtId +
        '") as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" and districtId="' +
        req.body.districtId +
        '") as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" and districtId="' +
        req.body.districtId +
        '") as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" and districtId="' +
        req.body.districtId +
        '") as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" and districtId="' +
        req.body.districtId +
        '") as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" and districtId="' +
        req.body.districtId +
        '") as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" and districtId="' +
        req.body.districtId +
        '") as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" and districtId="' +
        req.body.districtId +
        '") as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" and districtId="' +
        req.body.districtId +
        '") as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" and districtId="' +
        req.body.districtId +
        '") as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" and districtId="' +
        req.body.districtId +
        '") as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" and districtId="' +
        req.body.districtId +
        '") as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" and districtId="' +
        req.body.districtId +
        '") as beneficiaryFhtcTagPhotoCount1'
      );
    }
    if (req.body.subDistrictId && req.body.districtId) {
      updateObject.subDistrictId = req.body.subDistrictId;
      updateObject.districtId = req.body.districtId;
      countRecords = await sequelizes.query(
        'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '") as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '") as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" ) as beneficiaryFhtcTagPhotoCount1'
      );
    }
    if (req.body.panchayatId && req.body.subDistrictId && req.body.districtId) {
      updateObject.panchayatId = req.body.panchayatId;
      updateObject.subDistrictId = req.body.subDistrictId;
      updateObject.districtId = req.body.districtId;
      countRecords = await sequelizes.query(
        'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '") as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '") as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" ) as beneficiaryFhtcTagPhotoCount1'
      );
    }
    if (
      req.body.villageId &&
      req.body.subDistrictId &&
      req.body.districtId &&
      req.body.panchayatId
    ) {
      updateObject.villageId = req.body.villageId;
      updateObject.panchayatId = req.body.panchayatId;
      updateObject.subDistrictId = req.body.subDistrictId;
      updateObject.districtId = req.body.districtId;
      countRecords = await sequelizes.query(
        'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '") as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '") as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" and districtId="' +
        req.body.districtId +
        '" and subDistrictId="' +
        req.body.subDistrictId +
        '" and panchayatId="' +
        req.body.panchayatId +
        '" and villageId="' +
        req.body.villageId +
        '" and villageId="' +
        req.body.villageId +
        '" ) as beneficiaryFhtcTagPhotoCount1'
      );
    }

    const id = decodeToken(req, res);
    const role_id = decodeRoleId(req, res);
    if (role_id == 1) {
      if (!req.body.districtId) {
        countRecords = await sequelizes.query(
          'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" ) as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" ) as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" ) as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" ) as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" ) as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" ) as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" ) as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" ) as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" ) as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" ) as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" ) as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" ) as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" ) as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" ) as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" ) as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" ) as beneficiaryFhtcTagPhotoCount1'
        );
      }
      const houseHoldRes = await db.houseHold.findAll({
        attributes: [
          "id",
          "villageId",
          "districtId",
          "subDistrictId",
          "panchayatId",
          "adharNumber",
          "createdAt",
          "waterCertificate",
          "lgdCode",
          "imisCode",
          "villageSchemWorking",
          "everyHouseWater",
          [
            sequelize.fn("count", sequelize.col("villageSchemWorking")),
            "waterCertificateCount",
          ],
          [
            sequelize.fn("count", sequelize.col("waterCertificate")),
            "waterCertificateCount",
          ],
          "idAdharPhotoClick",
          [
            sequelize.fn("count", sequelize.col("idAdharPhotoClick")),
            "idAdharPhotoClickCount",
          ],
          "regularWaterSupply",
          [
            sequelize.fn("count", sequelize.col("regularWaterSupply")),
            "regularWaterSupplyCount",
          ],
          "supplyWaterQuality",
          [
            sequelize.fn("count", sequelize.col("supplyWaterQuality")),
            "supplyWaterQualityCount",
          ],
          "cmThankyouCertificateInHand",
          [
            sequelize.fn("count", sequelize.col("cmThankyouCertificateInHand")),
            "cmThankyouCertificateInHandCount",
          ],
          "cmThankyouCertificateRecevied",
          [
            sequelize.fn(
              "count",
              sequelize.col("cmThankyouCertificateRecevied")
            ),
            "cmThankyouCertificateReceviedCount",
          ],
          "beneficiaryFhtcTagPhoto",
          [
            sequelize.fn("count", sequelize.col("beneficiaryFhtcTagPhoto")),
            "beneficiaryFhtcTagPhotoCount",
          ],
        ],
        group: ["villageId"],
        // distinct: true,
        where: updateObject,
        group: ["beneficiaryFhtcTagPhoto"],
      });
      const taskAssign = await Promise.all(
        houseHoldRes.map(async (task) => {
          task = task.toJSON();
          task.district = await db.distric.findAll({
            where: { id: task.districtId },
          });
          task.subDistrict = await db.subDistric.findAll({
            where: { id: task.subDistrictId },
          });
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          countRecord: countRecords[0],
          data: taskAssign,
          status: 200,
        });
      } else {
        return res.send({
          status: 404,
        });
      }
    }
    if (role_id == 2) {
      const users = await db.user.findOne({ where: { id: id } });
      if (users) {
        updateObject.districtId = users.districId;
        countRecords = await sequelizes.query(
          'select (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where villageSchemWorking="yes" and districtId="' +
          req.body.districtId +
          '") as villageSchemWorkingCount, (SELECT  count(`villageSchemWorking`) AS `villageSchemWorkingCount` from household_infos where  villageSchemWorking="no" and districtId="' +
          req.body.districtId +
          '") as villageSchemWorkingCount1, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="yes" and districtId="' +
          req.body.districtId +
          '") as waterCertificateCount, (SELECT  count(`waterCertificate`) as `waterCertificateCount` from household_infos where  waterCertificate="no" and districtId="' +
          req.body.districtId +
          '") as waterCertificateCount1,(SELECT  count(`everyHouseWater`) as `waterCertificateCount` from household_infos where  everyHouseWater="yes" and districtId="' +
          req.body.districtId +
          '") as everyHouseWaterCount, (SELECT  count(`everyHouseWater`) as `everyHouseWatercount` from household_infos where  everyHouseWater="no" and districtId="' +
          req.body.districtId +
          '") as everyHouseWaterCount1,(SELECT  count(`regularWaterSupply`) as `regularWaterSupplyc` from household_infos where  regularWaterSupply="yes" and districtId="' +
          req.body.districtId +
          '") as regularWaterSupplyCount, (SELECT  count(`regularWaterSupply`) as `regularWaterSupplycc` from household_infos where  regularWaterSupply="no" and districtId="' +
          req.body.districtId +
          '") as regularWaterSupplyCount1,(SELECT  count(`supplyWaterQuality`) as `supplyWaterQualityc` from household_infos where  supplyWaterQuality="yes" and districtId="' +
          req.body.districtId +
          '") as assupplyWaterQualityCount, (SELECT  count(`supplyWaterQuality`) as `supplyWaterQualitycc` from household_infos where  supplyWaterQuality="no" and districtId="' +
          req.body.districtId +
          '") as supplyWaterQualityCount1,(SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="yes" and districtId="' +
          req.body.districtId +
          '") as cmThankyouCertificateInHandCount, (SELECT  count(`supplyWaterQuality`) as `cmThankyouCertificateInHandc` from household_infos where  cmThankyouCertificateInHand="no" and districtId="' +
          req.body.districtId +
          '") as cmThankyouCertificateInHandCount1,(SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedc` from household_infos where  cmThankyouCertificateRecevied="yes" and districtId="' +
          req.body.districtId +
          '") as cmThankyouCertificateReceviedCount, (SELECT  count(`cmThankyouCertificateRecevied`) as `cmThankyouCertificateReceviedcc` from household_infos where  cmThankyouCertificateRecevied="no" and districtId="' +
          req.body.districtId +
          '") as cmThankyouCertificateReceviedCount1,(SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotoc` from household_infos where  beneficiaryFhtcTagPhoto="yes" and districtId="' +
          req.body.districtId +
          '") as beneficiaryFhtcTagPhotoCount, (SELECT  count(`beneficiaryFhtcTagPhoto`) as `beneficiaryFhtcTagPhotocc` from household_infos where  beneficiaryFhtcTagPhoto="no" and districtId="' +
          req.body.districtId +
          '") as beneficiaryFhtcTagPhotoCount1'
        );
      }
      const houseHoldRes = await db.houseHold.findAll({
        attributes: [
          "id",
          "villageId",
          "districtId",
          "subDistrictId",
          "panchayatId",
          "adharNumber",
          "createdAt",
          "waterCertificate",
          "lgdCode",
          "imisCode",
          "villageSchemWorking",
          "everyHouseWater",
          [
            sequelize.fn("count", sequelize.col("villageSchemWorking")),
            "waterCertificateCount",
          ],
          [
            sequelize.fn("count", sequelize.col("waterCertificate")),
            "waterCertificateCount",
          ],
          "idAdharPhotoClick",
          [
            sequelize.fn("count", sequelize.col("idAdharPhotoClick")),
            "idAdharPhotoClickCount",
          ],
          "regularWaterSupply",
          [
            sequelize.fn("count", sequelize.col("regularWaterSupply")),
            "regularWaterSupplyCount",
          ],
          "supplyWaterQuality",
          [
            sequelize.fn("count", sequelize.col("supplyWaterQuality")),
            "supplyWaterQualityCount",
          ],
          "cmThankyouCertificateInHand",
          [
            sequelize.fn("count", sequelize.col("cmThankyouCertificateInHand")),
            "cmThankyouCertificateInHandCount",
          ],
          "cmThankyouCertificateRecevied",
          [
            sequelize.fn(
              "count",
              sequelize.col("cmThankyouCertificateRecevied")
            ),
            "cmThankyouCertificateReceviedCount",
          ],
          "beneficiaryFhtcTagPhoto",
          [
            sequelize.fn("count", sequelize.col("beneficiaryFhtcTagPhoto")),
            "beneficiaryFhtcTagPhotoCount",
          ],
        ],
        where: updateObject,
        group: ["beneficiaryFhtcTagPhoto"],
        //order: [["createdAt", "DESC"]]
      });
      const taskAssign = await Promise.all(
        houseHoldRes.map(async (task) => {
          task = task.toJSON();
          task.district = await db.distric.findAll({
            where: { id: task.districtId },
          });
          task.subDistrict = await db.subDistric.findAll({
            where: { id: task.subDistrictId },
          });
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          count: houseHoldRes.count,
          data: taskAssign,
          countRecord: countRecords[0],
          status: 200,
        });
      } else {
        return res.send({
          status: 404,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
    });
  }
});

router.post("/getAllHouseholdAdvancedReport", async (req, res, next) => {
  try {
    let count = 0;
    if (!req.body.districtId) {
      const district = await db.distric.findAll({
        attributes: ["id", "name"],
      });
      const assig = await Promise.all(
        district.map(async (test) => {
          test = test.toJSON();
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: {
              districId: test.id,
            },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              districtId: test.id,
            },
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.id,
            },
          });
          test.houseHold = await db.houseHold.findAll({
            attributes: [
              "id",
              "villageId",
              [
                sequelize.fn("count", sequelize.col("everyHouseWater")),
                "everyHouseWaterCount",
              ],
              [
                sequelize.fn("count", sequelize.col("villageId")),
                "villageIdCount",
              ],
              "districtId",
              "subDistrictId",
              [
                sequelize.fn("count", sequelize.col("subDistrictId")),
                "subDistrictIdCount",
              ],
              "panchayatId",
              [
                sequelize.fn("count", sequelize.col("panchayatId")),
                "panchayatIdCount",
              ],
              "adharNumber",
              "waterCertificate",
              "lgdCode",
              "imisCode",
              "villageSchemWorking",
              "everyHouseWater",
              [
                sequelize.fn("count", sequelize.col("villageSchemWorking")),
                "villageSchemWorkingCount",
              ],
              [
                sequelize.fn("count", sequelize.col("waterCertificate")),
                "waterCertificateCount",
              ],
              "idAdharPhotoClick",
              [
                sequelize.fn("count", sequelize.col("idAdharPhotoClick")),
                "idAdharPhotoClickCount",
              ],
              "regularWaterSupply",
              [
                sequelize.fn("count", sequelize.col("regularWaterSupply")),
                "regularWaterSupplyCount",
              ],
              "supplyWaterQuality",
              [
                sequelize.fn("count", sequelize.col("supplyWaterQuality")),
                "supplyWaterQualityCount",
              ],
              "cmThankyouCertificateInHand",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateInHand")
                ),
                "cmThankyouCertificateInHandCount",
              ],
              "cmThankyouCertificateRecevied",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateRecevied")
                ),
                "cmThankyouCertificateReceviedCount",
              ],
              "beneficiaryFhtcTagPhoto",
              [
                sequelize.fn("count", sequelize.col("beneficiaryFhtcTagPhoto")),
                "beneficiaryFhtcTagPhotoCount",
              ],

              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.id +
                  "')"
                ),
                "totalVillage",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.id +
                  "' and everyHouseWater='yes')"
                ),
                "count1",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.id +
                  "' and waterCertificate='yes')"
                ),
                "count2",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.id +
                  "' and villageSchemWorking='yes')"
                ),
                "count3",
              ],
            ],
            where: {
              districtId: test.id,
            },
            distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 1,
          data: assig,
          status: 200,
        });
      }
    }
    if (req.body.districtId) {
      count = 1;
    }
    if (req.body.districtId && req.body.subDistricId) {
      count = 2;
    }
    if (req.body.districtId && req.body.subDistricId && req.body.panchayatId) {
      count = 3;
    }
    if (
      req.body.districtId &&
      req.body.subDistricId &&
      req.body.panchayatId &&
      req.body.villageId
    ) {
      count = 4;
    }
    //e.log(count);
    ///test new code as nin
    if (count == 1) {
      const subDistric = await db.subDistric.findAll({
        attributes: ["id", "name", "districId", "JJM_District"],
        where: {
          districId: req.body.districtId,
        },
      });
      const assig = await Promise.all(
        subDistric.map(async (test) => {
          test = test.toJSON();
          test.panchayat = await db.panchayat.findAll({
            attributes: [
              "districtId",
              "blockId",
              "name",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              blockId: test.id,
              districtId: test.districId,
            },
          });
          test.villageId = await db.village.findAll({
            attributes: [
              "id",
              "District_Id",
              "Block_ID",
              "Panchayat_ID",
              "name",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.districId,
              Block_ID: test.id,
            },
          });
          test.houseHold = await db.houseHold.findAll({
            attributes: [
              "id",
              "villageId",
              [
                sequelize.fn("count", sequelize.col("everyHouseWater")),
                "everyHouseWaterCount",
              ],
              [
                sequelize.fn("count", sequelize.col("villageId")),
                "villageIdCount",
              ],

              "districtId",
              "subDistrictId",
              [
                sequelize.fn("count", sequelize.col("subDistrictId")),
                "subDistrictIdCount",
              ],
              "panchayatId",
              [
                sequelize.fn("count", sequelize.col("panchayatId")),
                "panchayatIdCount",
              ],
              "adharNumber",
              "waterCertificate",
              "lgdCode",
              "imisCode",
              "villageSchemWorking",
              "everyHouseWater",
              [
                sequelize.fn("count", sequelize.col("villageSchemWorking")),
                "villageSchemWorkingCount",
              ],
              [
                sequelize.fn("count", sequelize.col("waterCertificate")),
                "waterCertificateCount",
              ],
              "idAdharPhotoClick",
              [
                sequelize.fn("count", sequelize.col("idAdharPhotoClick")),
                "idAdharPhotoClickCount",
              ],
              "regularWaterSupply",
              [
                sequelize.fn("count", sequelize.col("regularWaterSupply")),
                "regularWaterSupplyCount",
              ],
              "supplyWaterQuality",
              [
                sequelize.fn("count", sequelize.col("supplyWaterQuality")),
                "supplyWaterQualityCount",
              ],
              "cmThankyouCertificateInHand",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateInHand")
                ),
                "cmThankyouCertificateInHandCount",
              ],
              "cmThankyouCertificateRecevied",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateRecevied")
                ),
                "cmThankyouCertificateReceviedCount",
              ],
              "beneficiaryFhtcTagPhoto",
              [
                sequelize.fn("count", sequelize.col("beneficiaryFhtcTagPhoto")),
                "beneficiaryFhtcTagPhotoCount",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "')"
                ),
                "totalVillage",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "' and everyHouseWater='yes')"
                ),
                "count1",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "' and waterCertificate='yes')"
                ),
                "count2",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "' and villageSchemWorking='yes')"
                ),
                "count3",
              ],
            ],
            where: {
              districtId: test.districId,
              subDistrictId: test.id,
            },
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 2,
          data: assig,
          status: 200,
        });
      }
    }
    //test 2 done
    if (count == 2) {
      const panchayats = await db.panchayat.findAll({
        attributes: [
          "districtId",
          "blockId",
          "name",
          "panchayatSystemID",
          "JJM_District",
        ],
        where: {
          blockId: req.body.subDistricId,
          districtId: req.body.districtId,
        },
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.villageId = await db.village.findAll({
            attributes: [
              "id",
              "Sr_No",
              "District_Id",
              "Block_ID",
              "Panchayat_ID",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.districtId,
              Block_ID: test.blockId,
              Panchayat_ID: test.panchayatSystemID,
            },
          });
          test.blocks = await db.subDistric.findAll({
            attributes: ["id", "name", "State_Name", "JJM_District"],
            where: {
              id: test.blockId,
            },
          });

          test.houseHold = await db.houseHold.findAll({
            attributes: [
              "id",
              "villageId",
              [
                sequelize.fn("count", sequelize.col("everyHouseWater")),
                "everyHouseWaterCount",
              ],
              [
                sequelize.fn("count", sequelize.col("villageId")),
                "villageIdCount",
              ],

              "districtId",
              "subDistrictId",
              [
                sequelize.fn("count", sequelize.col("subDistrictId")),
                "subDistrictIdCount",
              ],
              "panchayatId",
              [
                sequelize.fn("count", sequelize.col("panchayatId")),
                "panchayatIdCount",
              ],
              "adharNumber",
              "waterCertificate",
              "villageSchemWorking",
              "everyHouseWater",
              [
                sequelize.fn("count", sequelize.col("villageSchemWorking")),
                "villageSchemWorkingCount",
              ],
              [
                sequelize.fn("count", sequelize.col("waterCertificate")),
                "waterCertificateCount",
              ],
              "idAdharPhotoClick",
              [
                sequelize.fn("count", sequelize.col("idAdharPhotoClick")),
                "idAdharPhotoClickCount",
              ],
              "regularWaterSupply",
              [
                sequelize.fn("count", sequelize.col("regularWaterSupply")),
                "regularWaterSupplyCount",
              ],
              "supplyWaterQuality",
              [
                sequelize.fn("count", sequelize.col("supplyWaterQuality")),
                "supplyWaterQualityCount",
              ],
              "cmThankyouCertificateInHand",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateInHand")
                ),
                "cmThankyouCertificateInHandCount",
              ],
              "cmThankyouCertificateRecevied",
              [
                sequelize.fn(
                  "count",
                  sequelize.col("cmThankyouCertificateRecevied")
                ),
                "cmThankyouCertificateReceviedCount",
              ],
              "beneficiaryFhtcTagPhoto",
              [
                sequelize.fn("count", sequelize.col("beneficiaryFhtcTagPhoto")),
                "beneficiaryFhtcTagPhotoCount",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and everyHouseWater='yes')"
                ),
                "count1",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' )"
                ),
                "totalVillage",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and waterCertificate='yes')"
                ),
                "count2",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and villageSchemWorking='yes')"
                ),
                "count3",
              ],
            ],
            where: {
              districtId: test.districtId,
              subDistrictId: test.blockId,
              panchayatId: test.panchayatSystemID,
            },
            distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 3,
          data: assig,
          status: 200,
        });
      }
    }
    //test3 done
    if (count == 3) {
      const panchayats = await db.village.findAll({
        where: {
          Block_ID: req.body.subDistricId,
          District_Id: req.body.districtId,
          Panchayat_ID: req.body.panchayatId,
        },
      });
      //console.log(panchayats)
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.houseHold = await db.houseHold.findAll({
            attributes: [
              "id",
              "villageId",
              [
                sequelize.fn("count", sequelize.col("everyHouseWater")),
                "everyHouseWaterCount",
              ],
              [
                sequelize.fn("count", sequelize.col("villageId")),
                "villageIdCount",
              ],

              "districtId",
              "subDistrictId",
              [
                sequelize.fn("count", sequelize.col("subDistrictId")),
                "subDistrictIdCount",
              ],
              "panchayatId",
              [
                sequelize.fn("count", sequelize.col("panchayatId")),
                "panchayatIdCount",
              ],
              "adharNumber",
              "waterCertificate",
              "lgdCode",
              "imisCode",
              "villageSchemWorking",
              "everyHouseWater",
              "idAdharPhotoClick",

              "regularWaterSupply",
              "supplyWaterQuality",
              "cmThankyouCertificateRecevied",

              "beneficiaryFhtcTagPhoto",

              "cmThankyouCertificateInHand",
              [
                sequelize.fn("count", sequelize.col("villageSchemWorking")),
                "villageSchemWorkingCount",
              ],
              [
                sequelize.fn("count", sequelize.col("waterCertificate")),
                "waterCertificateCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(regularWaterSupply)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "totalVillage",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(regularWaterSupply) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupply='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "regularWaterSupplyCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(supplyWaterQuality) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and supplyWaterQuality='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "supplyWaterQualityCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(cmThankyouCertificateInHand) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and cmThankyouCertificateInHand='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "cmThankyouCertificateInHandCount",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(cmThankyouCertificateRecevied) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and cmThankyouCertificateRecevied='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "cmThankyouCertificateReceviedCount",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(beneficiaryFhtcTagPhoto) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and beneficiaryFhtcTagPhoto='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "beneficiaryFhtcTagPhotoCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(idAdharPhotoClick) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and idAdharPhotoClick='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "idAdharPhotoClickCount",
              ],

              // Note the wrapping parentheses in the call below!
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(everyHouseWater)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and everyHouseWater='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count1",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(waterCertificate)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and waterCertificate='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count2",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageSchemWorking)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageSchemWorking='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count3",
              ],
            ],
            where: {
              districtId: test.District_Id,
              subDistrictId: test.Block_ID,
              panchayatId: test.Panchayat_ID,
              villageId: test.JJM_Village_Sys_ID,
            },
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 4,
          data: assig,
          status: 200,
        });
      }
    }
    //test 4 done
    if (count == 4) {
      const panchayats = await db.village.findAll({
        where: {
          Block_ID: req.body.subDistricId,
          District_Id: req.body.districtId,
          Panchayat_ID: req.body.panchayatId,
          JJM_Village_Sys_ID: req.body.villageId,
        },
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.houseHold = await db.houseHold.findAll({
            attributes: [
              "id",
              "villageId",
              [
                sequelize.fn("count", sequelize.col("everyHouseWater")),
                "everyHouseWaterCount",
              ],
              [
                sequelize.fn("count", sequelize.col("villageId")),
                "villageIdCount",
              ],

              "districtId",
              "subDistrictId",
              [
                sequelize.fn("count", sequelize.col("subDistrictId")),
                "subDistrictIdCount",
              ],
              "panchayatId",
              [
                sequelize.fn("count", sequelize.col("panchayatId")),
                "panchayatIdCount",
              ],
              "adharNumber",
              "waterCertificate",
              "lgdCode",
              "imisCode",
              "villageSchemWorking",
              "everyHouseWater",
              "idAdharPhotoClick",

              "regularWaterSupply",
              "supplyWaterQuality",
              "cmThankyouCertificateRecevied",

              "beneficiaryFhtcTagPhoto",

              "cmThankyouCertificateInHand",
              [
                sequelize.fn("count", sequelize.col("villageSchemWorking")),
                "villageSchemWorkingCount",
              ],
              [
                sequelize.fn("count", sequelize.col("waterCertificate")),
                "waterCertificateCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "totalVillage",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(regularWaterSupply) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupply='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "regularWaterSupplyCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(supplyWaterQuality) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and supplyWaterQuality='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "supplyWaterQualityCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(cmThankyouCertificateInHand) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and cmThankyouCertificateInHand='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "cmThankyouCertificateInHandCount",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(cmThankyouCertificateRecevied) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and cmThankyouCertificateRecevied='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "cmThankyouCertificateReceviedCount",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(beneficiaryFhtcTagPhoto) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and beneficiaryFhtcTagPhoto='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "beneficiaryFhtcTagPhotoCount",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(idAdharPhotoClick) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and idAdharPhotoClick='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "idAdharPhotoClickCount",
              ],

              // Note the wrapping parentheses in the call below!
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(everyHouseWater)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and everyHouseWater='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count1",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(waterCertificate)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and waterCertificate='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count2",
              ],
              [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageSchemWorking)) FROM household_infos  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageSchemWorking='yes' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "count3",
              ],
            ],
            where: {
              districtId: test.District_Id,
              subDistrictId: test.Block_ID,
              panchayatId: test.Panchayat_ID,
              villageId: test.JJM_Village_Sys_ID,
            },
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 4,
          data: assig,
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
    });
  }
});

router.post("/getallinstitues/:size/:page", async (req, res) => {
  try {
    let limit = parseInt(req.params.size);
    let offset = 0 + (req.params.page - 1) * limit;
    let updateObject = {};
    if (req.body.districtId) {
      updateObject.districtId = req.body.districtId;
    }
    if (req.body.villageId) {
      updateObject.villageId = req.body.villageId;
    }
    if (req.body.panchayatId) {
      updateObject.panchayatId = req.body.panchayatId;
    }

    const id = decodeToken(req, res);
    const role_id = decodeRoleId(req, res);
    if (role_id == 1) {
      if (req.body.subDistricId) {
        updateObject.subDistricId = req.body.subDistricId;
      }
      const results = await db.institute.findAndCountAll({
        where: updateObject,
        offset: offset,
        limit: limit,
      });
      const taskAssign = await Promise.all(
        results.rows.map(async (task) => {
          task = task.toJSON();
          if (task.districtId > 0) {
            task.district = await db.distric.findAll({
              where: { id: task.districtId },
            });
          }
          if (task.subDistricId > 0) {
            task.subDistrict = await db.subDistric.findAll({
              where: { id: task.subDistricId },
            });
          }
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          status: 200,
          count: results.count,
          data: taskAssign,
        });
      } else {
        return res.send({
          status: 404,
          message: "No Record Found!",
        });
      }
    }
    if (role_id != 1) {
      const users = await db.user.findOne({ where: { id: id } });
      if (users) {
        updateObject.districtId = users.districId;
      }
      const results = await db.institute.findAndCountAll({
        where: updateObject,
        offset: offset,
        limit: limit,
      });
      const taskAssign = await Promise.all(
        results.rows.map(async (task) => {
          task = task.toJSON();
          if (task.districtId > 0) {
            task.district = await db.distric.findAll({
              where: { id: task.districtId },
            });
          }
          if (task.subDistricId > 0) {
            task.subDistrict = await db.subDistric.findAll({
              where: { id: task.subDistricId },
            });
          }
          task.panchayat = await db.panchayat.findAll({
            where: { panchayatSystemID: task.panchayatId },
          });

          task.villageId = await db.village.findAll({
            where: { JJM_Village_Sys_ID: task.villageId },
          });
          return task;
        })
      );
      if (taskAssign) {
        return res.send({
          status: 200,
          count: results.count,
          data: taskAssign,
        });
      } else {
        return res.send({
          status: 404,
          message: "No Record Found!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
    });
  }
});

router.post("/getAdvancedAllInstitutes/:size/:page", async (req, res) => {
  try {
    let count = 0;
    let districParams = "";
    let districParamsSCount = "";
    let districParamsACount = "";

    let districParamsSWaterCount = "";
    let districParamsAWaterCount = "";
    let blockParams = {};
    let panchayatParams = {};
    let villageParams = {};

    if (
      req.body.districtId &&
      req.body.subDistricId &&
      req.body.panchayatId &&
      req.body.villageId
    ) {
      villageParams = {
        District_Id: req.body.districtId,
        Block_ID: req.body.subDistricId,
        Panchayat_ID: req.body.panchayatId,
        JJM_Village_Sys_ID: req.body.villageId,
      };

      panchayatParams = {
        blockId: req.body.subDistricId,
        districtId: req.body.districtId,
        PanchayatSystemId: req.body.panchayatId,
      };
      count = 4;
    } else if (
      req.body.districtId &&
      req.body.subDistricId &&
      req.body.panchayatId
    ) {
      blockParams = {
        id: req.body.districtId,
        districId: req.body.subDistricId,
      };
      panchayatParams = {
        districtId: req.body.districtId,
        blockId: req.body.subDistricId,
        PanchayatSystemId: req.body.panchayatId,
      };
      villageParams = {
        District_Id: req.body.districtId,
        Block_ID: req.body.subDistricId,
      };
      count = 3;
    } else if (req.body.districtId && req.body.subDistricId) {
      districParamsSCount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "'and type='1')";
      districParamsACount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and type='2')";

      districParamsACount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and type='3')";
      districParamsACount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and type='4')";
      districParamsACount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and type='5')";
      districParamsACount =
        "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and type='6')";

      districParamsSWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and  subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=1)";
      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=2)";

      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=3)";

      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=4)";

      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=5)";

      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=6)";

      districParamsAWaterCount =
        "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
        req.body.districtId +
        "' and subDistricId='" +
        req.body.subDistricId +
        "' and regularWaterSupplySchool='yes' AND type=2)";

      count = 2;

      districParams = { id: req.body.districtId };

      blockParams = {
        id: req.body.districtId,
        districId: req.body.districtId,
      };
      panchayatParams = {
        districtId: req.body.districtId,
        blockId: req.body.subDistricId,
      };
      villageParams = {
        District_Id: req.body.districtId,
        Block_ID: req.body.subDistricId,
      };
    } else if (req.body.districtId) {
      districParams = { id: req.body.districtId };
      blockParams = { districId: req.body.districtId };
      panchayatParams = { districtId: req.body.districtId };
      villageParams = { District_Id: req.body.districtId };
      count = 1;
    }
    if (!req.body.districtId) {
      const district = await db.distric.findAll({ attributes: ["id", "name"] });
      const assig = await Promise.all(
        district.map(async (test) => {
          test = test.toJSON();
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: {
              districId: test.id,
            },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              districtId: test.id,
            },
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.id,
            },
          });
          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "')"
                ),
                "totalVillage",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and type='1')"
                ),
                "total_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and  type='2')"
                ),
                "total_anganwadi_count",
              ],
              //new
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and  type='3')"
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and  type='4')"
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and  type='5')"
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and  type='6')"
                ),
                "total_others_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' AND type=1)"
                ),
                "water_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' and type=2)"
                ),
                "water_panchayat_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' and type=3)"
                ),
                "water_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' and type=5)"
                ),
                "water_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' and type=5)"
                ),
                "water_others_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.id +
                  "' and regularWaterSupplySchool='yes' and type=6)"
                ),
                "water_anganwadi_count",
              ],
              // [
              //   sequelize.literal("(SELECT COUNT(villageId)  FROM `Institutions` WHERE districtId='D09' and type='2' and regularWaterSupplySchool='yes')"),'test'
              // ],
            ],
            where: {
              districtId: test.id,
            },
            group: ["districtId", "subDistricId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 0,
          data: assig,
          status: 200,
        });
      }
    }
    if (count === 1) {
      const subDistrict = await db.subDistric.findAll({
        attributes: ["id", "name", "districId"],
        where: { districId: req.body.districtId },
      });
      const assig = await Promise.all(
        subDistrict.map(async (test) => {
          test = test.toJSON();
          districtName = await db.distric.findAll({
            attributes: ["name"],
            where: { id: test.districId },
            distinct: true,
          });
          test.JJM_District = districtName[0].name;
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: { districId: test.districId },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              "name",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              districtId: req.body.districtId,
              blockId: test.id,
            },
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: req.body.districtId,
              Block_ID: test.id,
            },
          });
          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "')"
                ),
                "totalVillage",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='1')"
                ),
                "total_school_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='2')"
                ),
                "total_anganwadi_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='3')"
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='4')"
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='5')"
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and type='6')"
                ),
                "total_other_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=1)"
                ),
                "water_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=2)"
                ),
                "water_anganwadi_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=3)"
                ),
                "water_panchayat_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=4)"
                ),
                "water_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=5)"
                ),
                "water_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and regularWaterSupplySchool='yes' AND type=6)"
                ),
                "water_other_count",
              ],
            ],
            where: {
              subDistricId: test.id,
            },
            group: ["districtId", "subDistricId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 1,
          data: assig,
          status: 200,
        });
      }
    }
    //testing for record 2
    if (count === 2) {
      const panchayats = await db.panchayat.findAll({
        attributes: ["name", "JJM_District", "panchayatSystemID"],
        where: {
          districtId: req.body.districtId,
          blockId: req.body.subDistricId,
        },
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          // console.log(test);
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              "name",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: { districId: req.body.districtId },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              districtId: req.body.districtId,
              blockId: req.body.subDistricId,
              // PanchayatSystemId: test.panchayatSystemID,
            },
            distinct: true,
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: req.body.districtId,
              Block_ID: req.body.subDistricId,
              Panchayat_ID: test.panchayatSystemID,
            },
            distinct: true,
          });
          // console.log(req.body);

          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              // [sequelize.literal("(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
              // req.body.districtId +
              // "' and subDistricId='" +
              // req.body.subDistricId +
              // "' and panchayatId='" +
              // test.panchayatSystemID +"'"), "totalVillage"],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "')"
                ),
                "totalVillage",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "'and type='1')"
                ),
                "total_school_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='2')"
                ),
                "total_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='3')"
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='4')"
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='5')"
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='6')"
                ),
                "total_other_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='3')"
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='4')"
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='5')"
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and type='6')"
                ),
                "total_other_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and  subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=1)"
                ),
                "water_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=2)"
                ),
                "water_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=3)"
                ),
                "water_panchayat_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=4)"
                ),
                "water_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=4)"
                ),
                "water_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and regularWaterSupplySchool='yes' AND type=6)"
                ),
                "water_other_count",
              ],
            ],
            where: {
              panchayatId: test.panchayatSystemID,
            },
            group: ["districtId", "subDistricId"],
          });

          // console.log(test.counters,test.panchayatSystemID);
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 2,
          data: assig,
          status: 200,
        });
      }
    }

    //working for 3
    if (count === 3) {
      console.log(req.body);
      const villages = await db.village.findAll({
        attributes: [
          "JJM_District",
          "JJM_Block",
          "JJM_Panchayat",
          "Block_ID",
          "District_Id",
          "Panchayat_ID",
          "name",
          "JJM_Village_Sys_ID",
        ],
        where: {
          District_Id: req.body.districtId,
          Block_ID: req.body.subDistricId,
          Panchayat_ID: req.body.panchayatId,
        }, //JJM_Village_Sys_ID: req.body.villageId
      });
      const assig = await Promise.all(
        villages.map(async (test) => {
          test = test.toJSON();
          // console.log("4___________________",test);
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: { id: req.body.subDistricId },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: panchayatParams,
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: villageParams,
          });
          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "totalVillage",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "'and type='1' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_school_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='2' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='3' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_panchayat_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='4' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_community_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='5' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_hostel_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='6' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_others_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='2' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='3' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_panchayat_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='4' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_community_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='5' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_hostel_count",
              ],

              [
                sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and type='6' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "total_others_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=1 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "') "
                ),
                "water_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=2 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "water_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=3 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "water_panchayat_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=4 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "water_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=5 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "water_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistricId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and regularWaterSupplySchool='yes' AND type=6 and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "water_others_count",
              ],
            ],
            where: {
              subDistricId: test.Block_ID,
              districtId: test.District_Id,
              villageId: test.JJM_Village_Sys_ID,
            },
            group: ["districtId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 3,
          data: assig,
          status: 200,
        });
      }
    }

    if (count === 4) {
      const villages = await db.village.findAll({
        attributes: [
          "JJM_District",
          "JJM_Block",
          "JJM_Panchayat",
          "name",
          "JJM_Village_Sys_ID",
        ],
        where: {
          District_Id: req.body.districtId,
          Block_ID: req.body.subDistricId,
          Panchayat_ID: req.body.panchayatId,
          JJM_Village_Sys_ID: req.body.villageId,
        },
      });
      const assig = await Promise.all(
        villages.map(async (test) => {
          test = test.toJSON();
          // console.log("last___________________",test);
          // test.subDistrict = await db.subDistric.findAll({
          //   attributes: [
          //     "id",
          //     [
          //       db.sequelize.fn("COUNT", db.sequelize.col("id")),
          //       "total_sub_district",
          //     ],
          //   ],
          //   where: blockParams,
          //   distinct: true,
          // });

          // test.panchayat = await db.panchayat.findAll({
          //   attributes: [
          //     [
          //       db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
          //       "total_panchayats",
          //     ],
          //   ],
          //   where: panchayatParams,
          // });

          // test.villageId = await db.village.findAll({
          //   attributes: [
          //     [
          //       db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
          //       "total_villages",
          //     ],
          //   ],
          //   where: villageParams,
          // });
          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              "imisCode",
              "lgdCode",
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "')")
                ),
                "totalVillage",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='1')")
                ),
                "total_school_count",
              ],

              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='2')")
                ),
                "total_anganwadi_count",
              ],

              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='3')")
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='4')")
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='5')")
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='6')")
                ),
                "total_others_count",
              ],

              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='2')")
                ),
                "total_anganwadi_count",
              ],

              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='3')")
                ),
                "total_panchayat_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='4')")
                ),
                "total_community_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='5')")
                ),
                "total_hostel_count",
              ],
              [
                sequelize.literal(
                  (districParamsSCount =
                    "(SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                    req.body.districtId +
                    "' and subDistricId='" +
                    req.body.subDistricId +
                    "' and panchayatId='" +
                    req.body.panchayatId +
                    "' and villageId='" +
                    req.body.villageId +
                    "'and type='6')")
                ),
                "total_others_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=1)"
                ),
                "water_school_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=2)"
                ),
                "water_anganwadi_count",
              ],

              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=3)"
                ),
                "water_panchayat_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=4)"
                ),
                "water_community_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=5)"
                ),
                "water_hostel_count",
              ],
              [
                sequelize.literal(
                  "( SELECT COUNT((villageId)) FROM Institutions  WHERE districtId='" +
                  req.body.districtId +
                  "' and subDistricId='" +
                  req.body.subDistricId +
                  "' and panchayatId='" +
                  req.body.panchayatId +
                  "' and villageId='" +
                  req.body.villageId +
                  "' and regularWaterSupplySchool='yes' AND type=6)"
                ),
                "water_other_count",
              ],
            ],
            where: {
              villageId: req.body.villageId,
            },
            group: ["districtId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 4,
          data: assig,
          status: 200,
        });
      }
    }

    if (3 == 4) {
      const district = await db.distric.findAll({
        where: { id: req.body.districtId },
      });
      const assig = await Promise.all(
        district.map(async (test) => {
          test = test.toJSON();
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: blockParams,
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: panchayatParams,
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: villageParams,
          });
          test.counters = await db.institute.findAll({
            attributes: [
              "id",
              "villageId",
              "districtId",
              "subDistrictId",
              "panchayatId",
              "imisCode",
              "lgdCode",
              [sequelize.literal(districParamsSCount), "total_school_count"],
              [sequelize.literal(districParamsACount), "total_anganwadi_count"],
              [
                sequelize.literal(districParamsSWaterCount),
                "water_school_count",
              ],
              [
                sequelize.literal(districParamsAWaterCount),
                "water_anganwadi_count",
              ],
            ],
            where: {
              subDistricId: test.id,
            },
            group: ["districtId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 1,
          data: assig,
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      error: error,
    });
  }
});

router.post("/dashboardData", async (req, res) => {
  try {
    const id = decodeToken(req, res);
    const role_id = decodeRoleId(req, res);
    const user = await db.user.findOne({
      where: {
        id: id,
      },
    });

    if (role_id == 1) {
      let count = 0;
      if (
        req.body.districtId &&
        req.body.subDistrictId &&
        req.body.panchayatId &&
        req.body.villageId
      ) {
        count = 4;
      } else if (
        req.body.districtId &&
        req.body.subDistrictId &&
        req.body.panchayatId
      ) {
        count = 3;
      } else if (req.body.districtId && req.body.subDistrictId) {
        count = 2;
      } else if (req.body.districtId) {
        count = 1;
      }

      if (count === 0) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const institutes = await db.institute.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions)"
              ),
              "total_anklit",
            ],
          ],
          order: [["createdAt", "DESC"]],
        });
        // console.log(villages);
        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      }

      if (count == 1) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const institutes = await db.institute.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "')"
              ),
              "total_anklit",
            ],
          ],
          where: {
            districtId: req.body.districtId,
          },
          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 2) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            subDistrictId: req.body.subDistrictId,
            districtId: req.body.districtId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 3) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            subDistrictId: req.body.subDistrictId,
            districtId: req.body.districtId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "'  and panchayatId='" +
                req.body.panchayatId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 4) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "'  and panchayatId='" +
                req.body.panchayatId +
                "'  and villageId='" +
                req.body.villageId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });
        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      }
    } else if (role_id !== 1) {

      let count = 0;
      if (
        req.body.districtId &&
        req.body.subDistrictId &&
        req.body.panchayatId &&
        req.body.villageId
      ) {
        count = 4;
      } else if (
        req.body.districtId &&
        req.body.subDistrictId &&
        req.body.panchayatId
      ) {
        count = 3;
      } else if (req.body.districtId && req.body.subDistrictId) {
        count = 2;
      } else if (req.body.districtId) {
        count = 1;
      }
      /*
      if (count === 0) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const institutes = await db.institute.findAll({
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions)"
              ),
              "total_anklit",
            ],
          ],
          order: [["createdAt", "DESC"]],
        });
        // console.log(villages);
        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      }*/

      if (count == 1) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const institutes = await db.institute.findAll({
          attributes: ["id", "districtId"],
          where: { districtId: req.body.districtId },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "')"
              ),
              "total_anklit",
            ],
          ],
          where: {
            districtId: req.body.districtId,
          },
          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 2) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            subDistrictId: req.body.subDistrictId,
            districtId: req.body.districtId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 3) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            subDistrictId: req.body.subDistrictId,
            districtId: req.body.districtId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "'  and panchayatId='" +
                req.body.panchayatId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });

        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      } else if (count == 4) {
        const assets = await db.assetsTracking.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId,
          },
          order: [["createdAt", "DESC"]],
        });

        const houseHolds = await db.houseHold.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistrictId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId,
          },
          order: [["createdAt", "DESC"]],
        });
        const institutes = await db.institute.findAll({
          attributes: ["id"],
          where: {
            districtId: req.body.districtId,
            subDistricId: req.body.subDistrictId,
            panchayatId: req.body.panchayatId,
            villageId: req.body.villageId
          },
          order: [["createdAt", "DESC"]],
        });

        const villages = await db.institute.findOne({
          attributes: [
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT(villageId)) FROM Institutions  WHERE districtId='" +
                req.body.districtId +
                "'  and subDistricId='" +
                req.body.subDistrictId +
                "'  and panchayatId='" +
                req.body.panchayatId +
                "'  and villageId='" +
                req.body.villageId +
                "')"
              ),
              "total_anklit",
            ],
          ],

          order: [["createdAt", "DESC"]],
        });
        if (assets && houseHolds && institutes && villages) {
          return res.send({
            status: 200,
            data: {
              assets: assets,
              household: houseHolds,
              institutes: institutes,
              villages: villages,
            },
          });
        } else {
          return res.send({
            status: 404,
            message: "No Record Found!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
    });
  }
});

router.get(
  "/getallhousehold/:villageId/:type/:size/:page",
  async (req, res, next) => {
    try {
      let task = {};
      let limit = parseInt(req.params.size);
      let offset = 0 + (req.params.page - 1) * limit;
      const houseHoldsss = await db.houseHold.findOne({
        where: { villageId: req.params.villageId },
      });
      task.houseHoldsss = houseHoldsss;

      task.district = await db.distric.findOne({
        attributes: ["id", "name", "State_Name"],
        where: { id: houseHoldsss.districtId },
      });
      task.subDistrict = await db.subDistric.findOne({
        attributes: ["id", "name", "State_Name", "JJM_District"],
        where: { id: houseHoldsss.subDistrictId },
      });
      task.panchayat = await db.panchayat.findOne({
        attributes: ["panchayatSystemID", "name", "State_Name", "JJM_District"],
        where: { panchayatSystemID: houseHoldsss.panchayatId },
      });

      task.villageId = await db.village.findOne({
        attributes: [
          "JJM_Village_Sys_ID",
          "name",
          "State_Name",
          "JJM_District",
        ],
        where: { JJM_Village_Sys_ID: houseHoldsss.villageId },
      });

      if (req.params.type == 1) {
        const houseHoldRes = await db.houseHold.findAll({
          attributes: [
            "villageId",
            "address",
            "adharImagePath",
            "adharNumber",
            "beneficiaryFhtcTagPhoto",
            "cmThankyouCertificateInHand",
            "cmThankyouCertificateRecevied",
            "districtId",
            "everyHouseWater",
            "fhtcTagPhotoPath",
            "fullname",
            "idAdharPhotoClick",
            "imisCode",
            "latitude",
            "lgdCode",
            "longitude",
            "mobileNumber",
            "panchayatId",
            "regularWaterSupply",
            "subDistrictId",
            "supplyWaterQuality",
            "villageSchemWorking",
            "waterCertificate",
          ],
          where: { villageId: req.params.villageId },
          //order: [["createdAt", "DESC"]]
          limit: 50,
        });
        const taskAssign = await Promise.all(
          houseHoldRes.map(async (task) => {
            task = task.toJSON();
            task.district = await db.distric.findAll({
              attributes: ["id", "name", "State_Name"],
              where: { id: task.districtId },
            });
            task.subDistrict = await db.subDistric.findAll({
              attributes: ["id", "name", "State_Name", "JJM_District"],
              where: { id: task.subDistrictId },
            });
            task.panchayat = await db.panchayat.findAll({
              attributes: [
                "panchayatSystemID",
                "name",
                "State_Name",
                "JJM_District",
              ],
              where: { panchayatSystemID: task.panchayatId },
            });

            task.villageId = await db.village.findAll({
              attributes: [
                "JJM_Village_Sys_ID",
                "name",
                "State_Name",
                "JJM_District",
              ],
              where: { JJM_Village_Sys_ID: task.villageId },
            });
            return task;
          })
        );
        if (taskAssign) {
          return res.send({
            houseHoldsss: houseHoldsss,
            count: houseHoldRes.count,
            data: taskAssign,
            status: 200,
          });
        } else {
          return res.status(400).send({
            status: 400,
          });
        }
      }
      if (req.params.type == 2) {
        const houseHoldRes = await db.houseHold.findAll({
          attributes: [
            "villageId",
            "address",
            "adharImagePath",
            "adharNumber",
            "beneficiaryFhtcTagPhoto",
            "cmThankyouCertificateInHand",
            "cmThankyouCertificateRecevied",
            "districtId",
            "everyHouseWater",
            "fhtcTagPhotoPath",
            "fullname",
            "idAdharPhotoClick",
            "imisCode",
            "latitude",
            "lgdCode",
            "longitude",
            "mobileNumber",
            "panchayatId",
            "regularWaterSupply",
            "subDistrictId",
            "supplyWaterQuality",
            "villageSchemWorking",
            "waterCertificate",
          ],
          where: { panchayatId: req.params.villageId },
          //order: [["createdAt", "DESC"]]
        });
        //   console.log(houseHoldRes);
        const taskAssign = await Promise.all(
          houseHoldRes.map(async (task) => {
            task = task.toJSON();
            task.district = await db.distric.findAll({
              attributes: ["id", "name", "State_Name"],
              where: { id: task.districtId },
            });
            task.subDistrict = await db.subDistric.findAll({
              attributes: ["id", "name", "State_Name", "JJM_District"],
              where: { id: task.subDistrictId },
            });
            task.panchayat = await db.panchayat.findAll({
              attributes: [
                "panchayatSystemID",
                "name",
                "State_Name",
                "JJM_District",
              ],
              where: { panchayatSystemID: task.panchayatId },
            });

            task.villageId = await db.village.findAll({
              attributes: [
                "JJM_Village_Sys_ID",
                "name",
                "State_Name",
                "JJM_District",
              ],
              where: { JJM_Village_Sys_ID: task.villageId },
            });
            return task;
          })
        );
        if (taskAssign) {
          return res.send({
            houseHoldsss: houseHoldsss,
            count: houseHoldRes.count,
            data: taskAssign,
            status: 200,
          });
        } else {
          return res.status(400).send({
            status: 400,
          });
        }
      }
      if (req.params.type == 3) {
        const houseHoldResCount = await db.houseHold.findAndCountAll({
          attributes: ["villageId"],
          where: { villageId: req.params.villageId },
          //order: [["createdAt", "DESC"]]
          limit: limit,
          offset: offset,
        });
        const houseHoldRes = await db.houseHold.findAll({
          attributes: [
            "villageId",
            "address",
            "adharImagePath",
            "adharNumber",
            "beneficiaryFhtcTagPhoto",
            "cmThankyouCertificateInHand",
            "cmThankyouCertificateRecevied",
            "districtId",
            "everyHouseWater",
            "fhtcTagPhotoPath",
            "fullname",
            "idAdharPhotoClick",
            "imisCode",
            "latitude",
            "lgdCode",
            "longitude",
            "mobileNumber",
            "panchayatId",
            "regularWaterSupply",
            "subDistrictId",
            "supplyWaterQuality",
            "villageSchemWorking",
            "waterCertificate",
          ],
          where: { villageId: req.params.villageId },
          //order: [["createdAt", "DESC"]]
          limit: limit,
          offset: offset,
        });
        const taskAssign = await Promise.all(
          houseHoldRes.map(async (task) => {
            task = task.toJSON();
            // task.district = await db.distric.findAll({
            //   attributes:["id","name","State_Name"],
            //   where: { id: task.districtId },
            // });
            // task.subDistrict = await db.subDistric.findAll({
            //   attributes:["id","name","State_Name","JJM_District"],
            //   where: { id: task.subDistrictId },
            // });
            // task.panchayat = await db.panchayat.findAll({
            //   attributes:["panchayatSystemID","name","State_Name","JJM_District"],
            //   where: { panchayatSystemID: task.panchayatId },
            // });

            // task.villageId = await db.village.findAll({
            //   attributes:["JJM_Village_Sys_ID","name","State_Name","JJM_District"],
            //   where: { JJM_Village_Sys_ID: task.villageId },
            // });
            return task;
          })
        );
        if (taskAssign) {
          return res.send({
            houseHoldsss: task,
            count: houseHoldResCount.count,
            data: houseHoldRes,
            status: 200,
          });
        } else {
          return res.status(400).send({
            status: 400,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
      });
    }
  }
);

router.post("/assetsAdvance", async (req, res, next) => {
  try {
    let count = 0;
    //console.log(req.body);
    if (!req.body.districtId) {
      const district = await db.distric.findAll({});
      // console.log(district);
      const assig = await Promise.all(
        district.map(async (test) => {
          test = test.toJSON();
          test.subDistrict = await db.subDistric.findAll({
            attributes: [
              "id",
              [
                db.sequelize.fn("COUNT", db.sequelize.col("id")),
                "total_sub_district",
              ],
            ],
            where: {
              districId: test.id,
            },
            distinct: true,
          });

          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              districtId: test.id,
            },
          });

          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.id,
            },
          });
          test.assets = await db.assetsTracking.findAll({
            attributes: [
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.id +
                  "')"
                ),
                "totalVillage",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.id +
                  "' and tubWellPhoto='yes')"
                ),
                "tubWellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.id +
                  "' and rccPhoto='yes')"
                ),
                "rccPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.id +
                  "' and sumpwellPhoto='yes')"
                ),
                "sumpwellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.id +
                  "' and pumpHousePhoto='yes')"
                ),
                "pumpHousePhotoCounts",
              ],
            ],
            where: {
              districtId: test.id,
            },
            distinct: true,
            group: ["districtId", "subDistrictId"],
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 1,
          data: assig,
          status: 200,
        });
      }
    }
    if (req.body.districtId) {
      count = 1;
    }
    if (req.body.districtId && req.body.subDistrictId) {
      count = 2;
    }
    if (req.body.districtId && req.body.subDistrictId && req.body.panchayatId) {
      count = 3;
    }
    if (
      req.body.districtId &&
      req.body.subDistrictId &&
      req.body.panchayatId &&
      req.body.villageId
    ) {
      count = 4;
    }
    // console.log(count)
    ///test new code as nin
    if (count == 1) {
      const subDistric = await db.subDistric.findAll({
        where: {
          districId: req.body.districtId,
        },
      });
      const assig = await Promise.all(
        subDistric.map(async (test) => {
          test = test.toJSON();
          test.panchayat = await db.panchayat.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("blockId")),
                "total_panchayats",
              ],
            ],
            where: {
              blockId: test.id,
              districtId: test.districId,
            },
          });
          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.districId,
              Block_ID: test.id,
            },
          });
          test.assets = await db.assetsTracking.findAll({
            attributes: [
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.districId +
                  "' and subDistrictId='" +
                  test.id +
                  "')"
                ),
                "totalVillage",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.districId +
                  "' and subDistrictId='" +
                  test.id +
                  "' and tubWellPhoto='yes')"
                ),
                "tubWellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "' and rccPhoto='yes')"
                ),
                "rccPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districId +
                  "' and  subDistrictId='" +
                  test.id +
                  "' and sumpwellPhoto='yes')"
                ),
                "sumpwellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districId +
                  "' and subDistrictId='" +
                  test.id +
                  "' and pumpHousePhoto='yes')"
                ),
                "pumpHousePhotoCounts",
              ],
            ],
            where: {
              districtId: test.districId,
            },
            distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 2,
          data: assig,
          status: 200,
        });
      }
    }

    //test 2 done
    if (count == 2) {
      const panchayats = await db.panchayat.findAll({
        where: {
          blockId: req.body.subDistrictId,
          districtId: req.body.districtId,
        },
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.villageId = await db.village.findAll({
            attributes: [
              [
                db.sequelize.fn("COUNT", db.sequelize.col("Sr_No")),
                "total_villages",
              ],
            ],
            where: {
              District_Id: test.districtId,
              Block_ID: test.blockId,
              Panchayat_ID: test.panchayatSystemID,
            },
          });
          test.blocks = await db.subDistric.findAll({
            where: {
              id: test.blockId,
            },
          });
          test.assets = await db.assetsTracking.findAll({
            attributes: [
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.districtId +
                  "' and subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "')"
                ),
                "totalVillage",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId))FROM assetstrackings  WHERE districtId='" +
                  test.districtId +
                  "' and subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and tubWellPhoto='yes')"
                ),
                "tubWellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and rccPhoto='yes')"
                ),
                "rccPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districtId +
                  "' and  subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and sumpwellPhoto='yes')"
                ),
                "sumpwellPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT(DISTINCT(villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.districtId +
                  "' and subDistrictId='" +
                  test.blockId +
                  "' and panchayatId='" +
                  test.panchayatSystemID +
                  "' and pumpHousePhoto='yes')"
                ),
                "pumpHousePhotoCounts",
              ],
            ],
            where: {
              districtId: test.districtId,
              subDistrictId: test.blockId,
              panchayatId: test.panchayatSystemID,
            },
            group: ["subDistrictId", "panchayatId"],
            distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 3,
          data: assig,
          status: 200,
        });
      }
    }
    //test3 done
    if (count == 3) {
      const panchayats = await db.village.findAll({
        where: {
          Block_ID: req.body.subDistrictId,
          District_Id: req.body.districtId,
          Panchayat_ID: req.body.panchayatId,
        },
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.assets = await db.assetsTracking.findAll({
            attributes: [
              // "villageId",
              // "districtId",
              // "subDistrictId",
              // "panchayatId",
              // "expenses",
              // "rccPhoto",
              // "sumpwellPhoto",
              // "pumpHousePhoto",
              // "tubWellPhoto",
              // "tubWellPhotoPath",
              // "tubWellPhotoRemark",
              // "rccPhotoPath",
              // "rccPhotoRemark",
              // "sumpwellPhotoPath",
              // "sumpwellPhotoRemark",
              // "pumpHousePhotoRemark",
              // "sumpwellPhotoRemark",
              // "rccPhotoRemark",
              // "tubWellPhotoRemark",

              [
                db.sequelize.literal(
                  "(SELECT count((villageId))FROM assetstrackings  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "')"
                ),
                "totalVillage",
              ],
              [
                db.sequelize.literal(
                  "(SELECT count((villageId))FROM assetstrackings  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "'  and sumpwellPhoto='yes' and type='3')"
                ),
                "sumpwellPhotoCount",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "' and rccPhoto='yes' and  type='2')"
                ),
                "rccPhotoCounts",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.District_Id +
                  "' and  subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "' and tubWellPhoto='yes' and type='1')"
                ),
                "tubWellPhotoCount",
              ],
              [
                db.sequelize.literal(
                  "(SELECT COUNT((villageId)) FROM assetstrackings  WHERE districtId='" +
                  test.District_Id +
                  "' and subDistrictId='" +
                  test.Block_ID +
                  "' and panchayatId='" +
                  test.Panchayat_ID +
                  "' and villageId='" +
                  test.JJM_Village_Sys_ID +
                  "' and pumpHousePhoto='yes' and  type='4')"
                ),
                "pumpHousePhotoCounts",
              ],
            ],
            where: {
              villageId: test.JJM_Village_Sys_ID,
              districtId: test.District_Id,
              subDistrictId: test.Block_ID,
              panchayatId: test.Panchayat_ID,
            },
            // group:['districtId']
            // distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 4,
          data: assig,
          status: 200,
        });
      }
    }
    //test 4 done

    if (count == 4) {
      const panchayats = await db.assetsTracking.findAll({
        attributes: [
          "expenses",
          "rccPhoto",
          "sumpwellPhoto",
          "pumpHousePhoto",
          "tubWellPhoto",
          "tubWellPhotoPath",
          "tubWellPhotoRemark",
          "rccPhotoPath",
          "rccPhotoRemark",
          "sumpwellPhotoPath",
          "sumpwellPhotoRemark",
          "pumpHousePhotoRemark",
          "sumpwellPhotoRemark",
          "pumpHousePhotoPath",
          "rccPhotoRemark",
          "tubWellPhotoRemark",
          "villageId",
          "panchayatId",
          "subDistrictId",
          "districtId",
        ],
        where: {
          subDistrictId: req.body.subDistrictId,
          districtId: req.body.districtId,
          panchayatId: req.body.panchayatId,
          villageId: req.body.villageId,
        },
        distinct: true,
      });
      const assig = await Promise.all(
        panchayats.map(async (test) => {
          test = test.toJSON();
          test.assets = await db.village.findAll({
            where: {
              District_Id: test.districtId,
              Block_ID: test.subDistrictId,
              Panchayat_ID: test.panchayatId,
              JJM_Village_Sys_ID: test.villageId,
            },
            distinct: true,
          });
          return test;
        })
      );
      if (assig) {
        return res.send({
          record: 5,
          data: assig,
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
    });
  }
});

/////new code write view details

router.get("/viewinstitutedetails/:villageId/:size/:page", async (req, res) => {
  try {
    let limit = parseInt(req.params.size);
    let offset = 0 + (req.params.page - 1) * limit;
    const villages = await db.village.findOne({
      attributes: [
        "JJM_District",
        "JJM_Block",
        "JJM_Panchayat",
        "name",
        "JJM_Village_Sys_ID",
      ],
      where: {
        JJM_Village_Sys_ID: req.params.villageId,
      },
    });
    const institutes = await db.institute.findAll({
      attributes: [
        "id",
        "imisCode",
        "lgdCode",
        "regularWaterSupplySchool",
        "regularWaterSupplySchoolRemark",
        "imisCode",
        "lgdCode",
        "latitude",
        "longitude",
        "photoPath",
        "address",
        "type",
      ],
      order: [["createdAt", "DESC"]],
      where: {
        villageId: req.params.villageId,
      },
      limit,
      offset,
    });
    if (institutes) {
      return res.send({
        villages: villages,
        data: institutes,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
    });
  }
});


//create directory and read files
const fs = require("fs");
const AdmZip = require("adm-zip");
const { url } = require("inspector");

router.post("/download/:districtId", async (req, res) => {
  console.log(req.hostname);
  const districtId = req.params.districtId;
  const houseHoldData = await db.houseHold.findAll({
    attributes: [
      "id",
      "fullname",
      "districtId",
      "adharNumber","adharImagePath"],
    where: {
      districtId: districtId,
    },
  })
  let dataResponseImages = [];
  const assig = await Promise.all(houseHoldData.map(async (test) => {
    test = test.toJSON();
    let newPath = "./public/" + test.fullname + test.id;
    // console.log('./public/' + test.adharImagePath)
    if (fs.existsSync('./public/' + test.adharImagePath)) {
      var oldPath = await './public/' + test.adharImagePath;
      test.imagePath= "./public/" + test.fullname + test.id + ".zip";
      await fs.access(newPath, (error) => {
        if (error) {
          fs.mkdir(newPath, { recursive: true }, (error) => {
            if (error) {
              console.log(error);
            } else {
              let newPathImag = newPath + "/" + test.adharNumber + ".jpeg";
              //copy iamge
              dataResponseImages.push(newPath)
              //console.log("test")
              fs.copyFile(oldPath, newPathImag, (err) => {
                if (err) {
                  console.log(err)
                  //console.log("test2")
                }
                else {
                  const zip = new AdmZip();
                  const outputFile = "./public/" + test.fullname + test.id + ".zip";

                  zip.addLocalFolder(newPath);
                  zip.writeZip(outputFile);
                }
               
                fs.rmSync('./public/'+ test.fullname + test.id, { recursive: true });
                
              });
            }
          });
        } else {
          console.log("Given Directory already exists !!");
        }
      })

    } else {
      // console.log('file not found!');
    }
    return test
  }))
  if (assig.length > 0) {
    res.send({
      status:200,
      data:assig
    })
  }
  else {
    res.send('no')
  }
})

router.post("/downloadzip", async (req, res) => {
  console.log(req.body)
const urls= req.body.url;
res.download(urls)
})









module.exports = router;
