require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);
const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
Set.belongsTo(Theme, { foreignKey: "theme_id" });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getAllSets() {
  return new Promise((resolve) => {
    Set.findAll({ include: [Theme] }).then((sets) => {
      resolve(sets);
    });
  });
}

async function getSetsByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({ include: [Theme], where: { set_num: setNum } }).then(
      (set) => {
        if (set != null) {
          resolve(set);
        } else {
          reject("Set not found");
        }
      }
    );
  });
}

async function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        "$Theme.name$": {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    }).then((sets) => {
      if (sets != null) {
        resolve(sets);
      } else {
        reject("Theme not found");
      }
    });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create(setData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll().then((themeData) => {
      resolve(themeData);
    });
  });
}

function editSet(update_set_num, setData) {
  return new Promise((resolve, reject) => {
    Set.update(setData, { where: { set_num: update_set_num } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function deleteSet(setNum) {
  return new Promise((resolve, reject) => {
    Set.destroy({ where: { set_num: setNum } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetsByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet
};
