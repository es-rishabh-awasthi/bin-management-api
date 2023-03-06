const express = require("express");
const app = express();
const router = express.Router();
var db = require("../models/");
var bins = db.tbl_sidetainer_element;
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

module.exports = router;