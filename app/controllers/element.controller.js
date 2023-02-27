const express = require("express");
const app = express();
const router = express.Router();
var db = require("../models");
var bins = db.tbl_addom_elemento;
bins.removeAttribute('id');
router.get('/getAll', async (req, res, next) => {
  try {
    const binData = await bins.findAll({
      where: {
      },
    })
// console.log(binData);
    if (binData.length > 0) {
      return res.send({
        status: 200,
        result: binData,
      });
    }
    return res.send({
      status: 404,
      message: "No Record Found"
    })
   
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})





router.get('/getDashboardData', async (req, res, next) => {
  
  try {

const sequelize = require('sequelize');

const query = "SELECT `modulo_id`, `dispositivo_id`, `codigo`, `latitud`, `longitud`, `punto`, `lleno`, `estado`, `llenado`, `activo`, (SELECT COUNT(`usuario_id`) as user_count FROM `addom_usuario`) as users, (SELECT COUNT(`ciudadano_id`) FROM `mod_ciudadano`) as citizen_count, (SELECT COUNT(`dispositivo_id`) FROM `addom_elemento` WHERE `activo`='1') as active_bin_count,(SELECT COUNT(`dispositivo_id`) FROM `addom_elemento` WHERE `activo`='0') as inactive_bin_count FROM `addom_elemento`;";

db.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(results => {
    if (results.length > 0) {
      return res.send({
        status: 200,
        result: results,
      });
    } else {
        return res.send({
            status: 404,
            message: "No Record Found!",
        });
    }
  })
  .catch(error => {
    console.error(error);
  });/*      const [results, metadata] = await db.query(
        "SELECT * FROM logs"
        // "SELECT * FROM Invoices JOIN Users ON Invoices.userId = Users.id"
      );
      
      console.log(JSON.stringify(results, null, 2));*/
   
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      err: error
    })
  }

})


module.exports = router;