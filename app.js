require("dotenv").config({});

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./DB");

const Portfolio = sequelize.define(
  "Portfolio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    patronum: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("М", "Ж", "Не указан"),
      allowNull: false,
      defaultValue: "Не указан",
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_have_children: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    is_married: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
  },
  {
    tableName: "portfolio",
    underscored: true,
    timestamps: true,
  }
);

const Joi = require("joi");

const createValidation = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
  });

  const validation_result = schema.validate(req.body);

  if (validation_result.error) {
    return res.status(422).json(validation_result.error);
  } else {
    next();
  }
};

app.get("/api/portfolio", async (req, res) => {
  const items = await Portfolio.findAll({});
  return res.status(200).json({
    items,
    meta: {},
  });
});

app.get("/api/portfolio/:id(\\d+)", async (req, res) => {
  const item = await Portfolio.findByPk(req.params.id);

  if (!item) {
    return res.sendStatus(404);
  }

  return res.status(200).json(item);
});

app.post("/api/portfolio", createValidation, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    return res.status(201).json(item);
  } catch (e) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

app.patch("/api/portfolio/:id", async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);

    if (!item) {
      return res.sendStatus(404);
    }

    if (req.body.first_name) item.first_name = req.body.first_name;
    if (req.body.last_name) item.last_name = req.body.last_name;

    await item.save();

    return res.status(200).json(item);
  } catch (e) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

app.delete("/api/portfolio/:id", async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);

    if (!item) {
      return res.sendStatus(404);
    }

    await item.destroy();

    return res.sendStatus(204);
  } catch (e) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

app.listen(port, async () => {
  //   await Portfolio.sync({
  //     alter: true,
  //     force: false,
  //   });
  console.log(`Example app listening on port ${port}`);
});
