const express = require("express");
const app = express();
const router = express.Router();
var db = require("../models");
var bins = db.tbl_addom_elemento;
bins.removeAttribute('id');
router.get('/getAll/:clientID', async (req, res, next) => {
  try {
    const sequelize = require('sequelize');
    const client_id = req.params.clientID;
    const query = "SELECT `id`, `modulo_id`, `dispositivo_id`, `codigo`, `latitud`, `longitud`, `punto`, `lleno`, `estado`, `llenado`, `activo`, (SELECT COUNT('empresa_id') as user_count FROM `addom_usuario` where empresa_id=" + client_id + ") as user_count, (SELECT COUNT(ciudadano_id) FROM `mod_ciudadano` where cliente_id=" + client_id + ") as citizen_count, (SELECT COUNT(clave) FROM `addom_elemento` where `activo`='1' AND `cliente_id`='" + client_id + "') as active_bin_count,(SELECT COUNT(clave) FROM `addom_elemento` where `activo`='0' AND `cliente_id`='" + client_id + "') as inactive_bin_count FROM `addom_elemento` where cliente_id =" + client_id + "";
    console.log(query);
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
      });
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})

router.post('/getBinAlarmsData', async (req, res, next) => {
  try {
    const sequelize = require('sequelize');
    const client_id = req.body.clientID;
    const bin_id = req.body.bin_id;
    console.log(req.body);
    const query = "SELECT * FROM `events` JOIN `logs` ON events.id = logs.id  WHERE `events`.device_id=" + bin_id + "  AND events.time BETWEEN DATE_SUB(NOW(), INTERVAL 100 DAY)  AND NOW() ORDER BY events.id DESC";
    console.log(query);
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
      });
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})

router.post('/getBinData', async (req, res, next) => {
  try {
    const sequelize = require('sequelize');
    const client_id = req.body.clientID;
    const bin_id = req.body.clientID;
    const query = "SELECT * FROM `events` JOIN `logs` ON events.id = logs.id  WHERE events.time BETWEEN DATE_SUB(NOW(), INTERVAL 100 DAY)  AND NOW() ORDER BY events.id DESC";
    console.log(query);
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
      });
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})


router.post('/getBigtainers', async (req, res, next) => {
  try {
    const sequelize = require('sequelize');
    const client_id = req.body.client_id;
    console.log(req.params);
    const query = "SELECT `id`, `modulo_id`, `cliente_id`, `dispositivo_id`, `codigo`, `matricula`, `barras`, `rfid`, `color_tapa`, `color_cuerpo`, `propietario`, `obs_maquina`, `explotador`, `fecha_inicio`, `fecha_final`, `obs_explotacion`, `latitud`, `longitud`, `poblacion`, `calle`, `numero`, `obs_ubicacion`, `foto_entorno`, `foto_detalle`, `hora_estado`, `capacidad`, `cantidad`, `lleno`," + " `estado`, `activo`, `diurno_inicio`, `diurno_final`, `tiempo_diurno_off`, `tiempo_nocturno_off`, `tiempo_diurno_on`, `tiempo_nocturno_on`, `Coords`, `punto`, `llenado`, `indicador`, `servicio`, `alarma`, `alarma_evento`, `marcador_1`, `marcador_2`, `marcador_3`, `marcador_4`, `marcador_5`, `marcador_6`, `marcador_7`, `compactador_fab`, `compactador_cod`, `compactador_sig1`, `compactador_sig2`, `compactador_prensa1`, `compactador_prensa2`, `compactador_horas`, `compactador_alarmas`, `sin_compactador`, `elemento_hora_alerta_00`, `elemento_hora_alerta_01`, `elemento_hora_alerta_02`, `elemento_hora_alerta_03`, `elemento_hora_alerta_04`, `elemento_hora_alerta_05`, `elemento_hora_alerta_06`, `elemento_hora_alerta_07`, `elemento_hora_alerta_08`, `elemento_hora_alerta_09`, `elemento_hora_alerta_10`, `elemento_hora_alerta_11`, `elemento_hora_alerta_12`, `elemento_hora_alerta_13`, `elemento_hora_alerta_14`, `elemento_hora_alerta_15`, `elemento_hora_alerta_16`, `elemento_hora_alerta_17`, `elemento_hora_alerta_18`, `elemento_hora_alerta_19`, `elemento_hora_alerta_20`, `elemento_hora_alerta_21`, `elemento_hora_alerta_22`, `elemento_hora_alerta_23`, `elemento_hora_alerta_24`, `elemento_hora_alerta_25`, `elemento_hora_alerta_26`, `elemento_hora_alerta_27`, `elemento_hora_alerta_28`, `elemento_hora_alerta_29`, `elemento_hora_alerta_30`, `elemento_hora_alerta_31`, `compactador_hora_alerta_00`, `compactador_hora_alerta_01`, `compactador_hora_alerta_02`, `compactador_hora_alerta_03`, `compactador_hora_alerta_04`, `compactador_hora_alerta_05`, `compactador_hora_alerta_06`, `compactador_hora_alerta_07`, `compactador_hora_alerta_08`, `compactador_hora_alerta_09`, `compactador_hora_alerta_10`, `compactador_hora_alerta_11`, `compactador_hora_alerta_12`, `compactador_hora_alerta_13`, `compactador_hora_alerta_14`, `compactador_hora_alerta_15`, `compactador_hora_alerta_16`, `compactador_hora_alerta_17`, `compactador_hora_alerta_18`, `compactador_hora_alerta_19`, `compactador_hora_alerta_20`, `compactador_hora_alerta_21`, `compactador_hora_alerta_22`, `compactador_hora_alerta_23`, `compactador_hora_alerta_24`, `compactador_hora_alerta_25`, `compactador_hora_alerta_26`, `compactador_hora_alerta_27`, `compactador_hora_alerta_28`, `compactador_hora_alerta_29`, `compactador_hora_alerta_30`, `compactador_hora_alerta_31`, `version` FROM `bilbotainer_elemento` WHERE cliente_id = " + client_id ;
    console.log(query);
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
      });
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})

router.post('/getSidetainers', async (req, res, next) => {
  try {
    const sequelize = require('sequelize');
    const client_id = req.body.client_id;
    console.log(req.params);
    const query = "SELECT `id`, `modulo_id`, `cliente_id`, `dispositivo_id`, `codigo`, `matricula`, `barras`, `rfid`, `color_tapa`, `color_cuerpo`, `propietario`, `obs_maquina`, `explotador`, `fecha_inicio`, `fecha_final`, `obs_explotacion`, `latitud`, `longitud`, `poblacion`, `calle`, `numero`, `obs_ubicacion`, `foto_entorno`, `foto_detalle`, `hora_estado`, `capacidad`, `cantidad`, `lleno`, `estado`, `activo`, `Coords`, `punto`, `llenado`, `indicador`, `servicio`, `alarma`, `alarma_evento`, `marcador_1`, `marcador_2`, `marcador_3`, `marcador_4`, `marcador_5`, `marcador_6`, `marcador_7`, `estado_buzon`, `indicador_buzon` FROM `sidetainer_elemento` WHERE  cliente_id =" + client_id;
    console.log(query);
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
      });
  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})


router.get('/getDashboardData/:clientID', async (req, res, next) => {

  try {

    const sequelize = require('sequelize');
    const client_id = req.params.clientID;
    const query = "SELECT `id`, `modulo_id`, `dispositivo_id`, `codigo`, `latitud`, `longitud`, `punto`, `lleno`, `estado`, `llenado`, `activo`, (SELECT COUNT('empresa_id') as user_count FROM `addom_usuario` where empresa_id=" + client_id + ") as user_count, (SELECT COUNT(ciudadano_id) FROM `mod_ciudadano` where cliente_id=" + client_id + ") as citizen_count, (SELECT COUNT(clave) FROM `addom_elemento` where `activo`='1' AND `cliente_id`='" + client_id + "') as active_bin_count,(SELECT COUNT(clave) FROM `addom_elemento` where `activo`='0' AND `cliente_id`='" + client_id + "') as inactive_bin_count FROM `addom_elemento` where cliente_id =" + client_id + "";
    console.log(query);
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