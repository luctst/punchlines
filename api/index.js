require("dotenv").config();
const chalk = require("chalk");
const express = require("express")();
const e = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require('helmet');

express.use(e.json());
express.use(cors());
express.use(helmet());
express.use(cookieParser());
express.use(compression());

express.get('/api/welcome', function (req, res) {
  return res.status(200).json({ message: 'Welcome on your api :)'});
});

express.listen(9229, function () {
    console.log(
        chalk`Api listening on port {cyan {bold ${9229}}}`
    );
});
