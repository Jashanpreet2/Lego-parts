/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Jashanpreet Singh Student ID: 112454228 Date: 27 November, 2023
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const HTTP_PORT = process.env.PORT || 8080;

const legoData = require("./modules/legoSets");

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "public/views/home"));
});

app.get("/about", (req, res) => {
  res.render(path.join(__dirname, "public/views/about"));
});

app.get("/lego/addSet", (req, res) => {
  legoData.getAllThemes().then((themeData) => {
    res.render(path.join(__dirname, "public/views/addSet"), {
      themes: themeData,
    });
  });
});

app.post("/lego/addSet", (req, res) => {
  legoData
    .addSet(req.body)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render(path.join(__dirname, "public/views/500"), {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.get("/lego/sets", (req, res) => {
  if (req.query.theme) {
    legoData
      .getSetsByTheme(req.query.theme)
      .then((legoSets) => {
        res.render(path.join(__dirname, "public/views/sets"), {
          data: legoSets,
        });
      })
      .catch((reason) => {
        res.status(404).render("404", {
          message: "I'm sorry, we're unable to find what you're looking for",
        });
      });
  } else if (!req.query.theme) {
    legoData
      .getAllSets()
      .then((sets) => {
        res.render(path.join(__dirname, "public/views/sets"), { data: sets });
      })
      .catch((reason) => {
        res.status(404).render(
          path.join(__dirname, "public/views/404", {
            message: "I'm sorry, we're unable to find what you're looking for",
          })
        );
      });
  }
});

app.get("/lego/sets/:setNum", (req, res) => {
  legoData
    .getSetsByNum(req.params.setNum)
    .then((legoSet) => {
      res.render(path.join(__dirname, "public/views/set"), { set: legoSet });
    })
    .catch(() => {
      res.status(404).render("404", {
        message: "I'm sorry, we're unable to find what you're looking for",
      });
    });
});

app.get("/lego/editSet/:setNum", (req, res) => {
  legoData
    .getSetsByNum(req.params.setNum)
    .then((setData) => {
      legoData
        .getAllThemes()
        .then((themeData) => {
          res.render(path.join(__dirname, "public/views/editSet"), {
            themes: themeData,
            set: setData,
          });
        })
        .catch((err) => {
          res
            .status(404)
            .render(path.join(__dirname, "public/views/404"), { message: err });
        });
    })
    .catch(() => {
      res.status(404).render(path.join(__dirname, "public/views/404"), {
        message: "I'm sorry, we're unable to find what you're looking for",
      });
    });
});

app.post("/lego/editSet", (req, res) => {
  legoData
    .editSet(req.body.set_num, req.body)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render(path.join(__dirname, "public/views/500"), {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.get("/lego/deleteSet/:num", (req, res) => {
  legoData
    .deleteSet(req.params.num)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render(path.join(__dirname,"public/views/500"), {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
});
