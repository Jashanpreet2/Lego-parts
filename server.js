const express = require("express");
const path = require("path");
const app = express();
const clientSessions = require("client-sessions");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  clientSessions({
    cookieName: "session",
    secret: "o6LjQ5EVNC28ZgK64hDELM18ScpFQr",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
const authData = require("./modules/auth-service");
const HTTP_PORT = process.env.PORT || 8080;

const legoData = require("./modules/legoSets");

function ensureLogin(req, res) {
  if (!req.session.user) {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "public/views/home"));
});

app.get("/login", (req, res) => {
  res.render(path.join(__dirname, "/public/views/login"));
});

app.post("/login", (req,res) => {
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body).then((user) => {
    req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
    }
    res.redirect('/lego/sets');
  })
  .catch ((err)=> {
    res.render(path.join(__dirname, "/public/views/login"), {errorMessage: err, userName: req.body.userName});
  })
});

app.get("/logout", (req,res) => {
  ensureLogin(req, res);
  req.session.reset();
  res.redirect('/');
})

app.get("/userHistory", (req,res) => {
  res.render(path.join(__dirname, "/public/views/userHistory"));
})

app.get("/register", (req, res) => {
  res.render(path.join(__dirname, "/public/views/register"));
});

app.post("/register", (req, res) => {
  authData.registerUser(req.body).then(() => {
    res.render(path.join(__dirname, "/public/views/register"), {
      successMessage: "User created",
    });
  }).catch((err) =>{
    res.render(path.join(__dirname, "/public/views/register"), {
      errorMessage: err, userName: req.body.userName
    });
  })
});

app.get("/about", (req, res) => {
  res.render(path.join(__dirname, "public/views/about"));
});

app.get("/lego/addSet", (req, res) => {
  ensureLogin(req, res);
  legoData.getAllThemes().then((themeData) => {
    res.render(path.join(__dirname, "public/views/addSet"), {
      themes: themeData,
    });
  });
});

app.post("/lego/addSet", (req, res) => {
  ensureLogin(req, res);
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
  ensureLogin(req, res);
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
  ensureLogin(req, res);
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
  ensureLogin(req, res);
  legoData
    .deleteSet(req.params.num)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render(path.join(__dirname, "public/views/500"), {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

legoData
  .initialize()
  .then(authData.initialize)
  .then(() => {
    app.listen(HTTP_PORT, function () {
      console.log(`app listening on:  ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(`unable to start server: ${err}`);
  });
