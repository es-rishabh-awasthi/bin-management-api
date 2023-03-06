const express = require("express");
const router = express.Router();
var db = require("../models");
var alarms = db.tbl_addom_alarma;
alarms.removeAttribute('id');
router.get('/getAll/:id', async (req, res, next) => {  
  try {
const sequelize = require('sequelize');
modulo_id = req.params.id;
const query = `SELECT * FROM addom_alarma WHERE modulo_id=${modulo_id}`;

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

})
router.get('/getAll', async (req, res, next) => {  
  try {
const sequelize = require('sequelize');
modulo_id = req.params.id;
const query = `SELECT * FROM addom_alarma`;

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

})

router.get('/getAll_4_march', async (req, res, next) => {
  try {
    const alarmData = await alarms.findAll({
      where: {
        // alarma_activo: 1
      },
      // order: [
      //   ['id', 'DESC'],
      // ],
    })
// console.log(alarmData);
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

router.post('/createroom', async (req, res, next) => {
 // console.log(req.body)
  try {
    const roomName = 'chat' + req.body.user_id + req.body.admin_id;
    const rooomExits = await room.findOne({
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