require('regenerator-runtime/runtime');
require("dotenv").config();
const express = require("express")();
const e = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require('helmet');
const i18n = require('i18n');
const path = require('path');

const connectBdd = require('@/middlewares/bdd');
const baseApiUrl = require('@/utils/baseApiUrl');
const config = require('@/config');

const examplesRoutes = require('@/routes/example');

switch (process.env.NODE_ENV) {
  case 'development':
    process.env.CORS = process.env.CORS_URL_DEV;
    process.env.DB_URL = process.env.DB_URL_DEV;
    break;
  default:
    process.env.CORS = process.env.CORS_URL_PROD;
    process.env.DB_URL = process.env.DB_URL_PROD;
    break;
}

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, 'i18n'),
  api: {
    __: '$t',
  },
  objectNotation: true,
  defaultLocale: 'en',
});

express.use(connectBdd());
express.use(e.json());
express.use(cors({
  origin: process.env.CORS,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type",
}));
express.use(helmet());
express.use(cookieParser());
express.use(compression());
express.use(i18n.init);

express.get(baseApiUrl(), function (req, res) {
  return res.status(200).json({ message: `Welcome on your api :) you're using version ${ config.apiVersion }`});
});

express.use(baseApiUrl('/example'), examplesRoutes);

express.listen(9229, function () {
    console.log(`Api listening on port ${9229}`);
});
