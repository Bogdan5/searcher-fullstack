const express = require('express');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const path = require('path');

const router = express.Router();
// const passport = require('passport');
const upload = multer({ dest: 'tmp/csv/' });

// const upload = require("express-fileupload");
const csvtojson = require("csvtojson");
let csvData = 'test';

// Load User model
const User = require('../../models/User');

// @route POST api/upload-csv
// @desc Upload file
// @access Public
// , passport.authenticate('jwt', { session: false })
router.post('/',
  upload.single('file'), function (req, res) {
  console.log('start post');
  const fileRows = [];

  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      // if (fileRows.length === 1) {
      //   const header = fileRows[0];
      //   const headerArray = header.split(',');
      //   const trimmed = headerArray.map(el => el.trim());
      // }
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows)
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      return res.sendStatus(200).end();
    })
    .on('error', (err) => res.sendStatus(404).end('Error in file upload: ', err));
});

// router.post('/', upload.any(), (req, res) => {
//   console.log('start myFile: ', req.files.myFile);
//   /** convert req buffer into csv string , 
//   *   "csvfile" is the name of my file given at name attribute in input tag */
//     csvData = req.files.myFile.data.toString('utf8');
//     return csvtojson().fromString(csvData).then(json => 
//       { 
//         console.log('csvData', JSON.stringify(csvData));
//         return res.status(201).json({csv:csvData, json:json})
//       }
//     );
// });

// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: function(req, file, cb){
//      cb(null,"CSV-" + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000},
// }).single("myFile");

// router.post("/upload", upload(req, res, (err) => {
//      console.log("Request ---", req.body);
//      console.log("Request file ---", req.file); //Here you get file.
//      /*Now do where ever you want to do*/
//      if(!err)
//         return res.send(200).end();
//   })
// );

// function (req, file, callback) {
//   fs.mkdir('./uploads', function(err) {
//     if(err) {
//         console.log(err.stack)
//     } else {
//         callback(null, './uploads');
//     }
// })
// }
// var storage =   multer.diskStorage({
//   destination: '/uploads',
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });

// router.post('/',function(req,res){
//   var upload = multer({ storage : storage}).single('file');
//   upload(req,res,function(err) {
//       if(err) {
//         return res.end("Error uploading file.");
//       }
//       console.log(req);
//       res.end("File is uploaded");
//   });
// });

module.exports = router;
