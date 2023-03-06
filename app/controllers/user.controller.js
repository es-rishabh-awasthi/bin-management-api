const express = require("express");
const app = express();
const router = express.Router();
var db = require("../models");
var user = db.tbl_addom_usuario;
user.removeAttribute('id');

router.get('/getAllClients', async (req, res, next) => {
  try{
  const sequelize = require('sequelize');

const query = "SELECT `cliente_id`, `cliente_nom`, `cliente_servicio_ini`, `cliente_servicio_fin`, `cliente_contacto`, `cliente_email`, `cliente_tel`, `cliente_logo`, `cliente_abr`, `idioma_id`, `cliente_coment`, `cliente_activo`, `cliente_global`, `cliente_zona_horaria`, `cliente_ciudad` FROM `addom_cliente`";

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
    console.log(error);
    res.send({
      status: 500,
      err: error
    })
  }

});

router.get('/getAllManager', async (req, res, next) => {
  try{
  const sequelize = require('sequelize');

const query = "SELECT `usuario_id`, `empresa_id`, `idioma_id`, `usuario_nom`, `usuario_usu`, `usuario_cla`, `usuario_mail`, `usuario_tel`, `usuario_codigo`, `usuario_tarjeta`, `usuario_activo`, `usuario_sesion`, `usuario_ip`, `usuario_acceso`, `usuario_conectado`, `usuario_remote` FROM `addom_usuario` ";

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
    console.log(error);
    res.send({
      status: 500,
      err: error
    })
  }

});
router.post('/loginManager', async (req, res, next) => {
  try{
  const sequelize = require('sequelize');

const query = "SELECT `usuario_id`, `empresa_id`, `idioma_id`, `usuario_nom`, `usuario_usu`, `usuario_cla`, `usuario_mail`, `usuario_tel`, `usuario_codigo`, `usuario_tarjeta`, `usuario_activo`, `usuario_sesion`, `usuario_ip`, `usuario_acceso`, `usuario_conectado`, `usuario_remote` FROM `addom_usuario` WHERE `usuario_mail`= '"+ req.body.email + "' AND `usuario_cla`= '"+ req.body.password + "';";

db.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(results => {
    if (results.length > 0) {
      return res.send({
        status: 200,
        result: results[0],
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
    console.log(error);
    res.send({
      status: 500,
      err: error
    })
  }

});

router.post('/getAllClients', async (req, res, next) => {
  try{
  const sequelize = require('sequelize');

const query = "SELECT `usuario_id`, `empresa_id`, `idioma_id`, `usuario_nom`, `usuario_usu`, `usuario_cla`, `usuario_mail`, `usuario_tel`, `usuario_codigo`, `usuario_tarjeta`, `usuario_activo`, `usuario_sesion`, `usuario_ip`, `usuario_acceso`, `usuario_conectado`, `usuario_remote` FROM `addom_usuario` ";

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
    console.log(error);
    res.send({
      status: 500,
      err: error
    })
  }

});


router.get('/getAll', async (req, res, next) => {
  try {
    const alarmData = await user.findAll({
      where: {
        
      },
        })
console.log(alarmData);
    if (alarmData.length > 0) {
      return res.send({
        status: 200,
        result: alarmData,
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

router.post('/create', async (req, res, next) => {
 // console.log(req.body)
  try {
    const roomName = 'chat' + req.body.user_id + req.body.admin_id;
    const rooomExits = await user.findOne({
      where: {
        room_name: roomName,
        user_id: req.body.user_id,
        admin_id: req.body.admin_id
      }
    })
    if (!rooomExits) {
      const rooms = await room.create({
        room_name: roomName,
        user_id: req.body.user_id,
        admin_id: req.body.admin_id
      })
      if (!rooms) {
        return res.send({
          status: 204,
          message: "No Content"
        })
      }
      return res.send({
        status: 200,
        data: rooms
      })
    }
    return res.send({
      status: 208,
      data: rooomExits
    })

  } catch (error) {
    res.send({
      status: 500,
      err: error
    })
  }
})

router.get('/getLastRecord',async (req,res,next) =>{
  try {
    const allmessage = await chat.findAll({
      limit: 1,
    order: [ [ 'createdAt', 'DESC' ]]
    })

    if (allmessage.length > 0) {
      return res.send({
        status: 200,
        result: allmessage,
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

module.exports = router;