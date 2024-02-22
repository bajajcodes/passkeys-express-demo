const base64url = require("base64url");
const passport = require("passport");
const uuid = require("uuid").v4;

class AuthController {
  register = (_, res) => {
    res.render("auth/register");
  };

  login = (_, res) => {
    res.render("auth/login");
  };

  createChallengeFrom = (store) => {
    return (req, res, next) => {
      const user = {
        id: uuid({}, Buffer.alloc(16)),
        name: req.body.username,
      };

      store.challenge(req, { user }, (err, challenge) => {
        if (err) return next(err);
        user.id = base64url.encode(user.id);

        res.json({ user, challenge: base64url.encode(challenge) });
      });
    };
  };

  passportCheck = () => {
    return passport.authenticate("webauthn", {
      failureMessage: true,
      failWithError: true,
    });
  };

  admitUser = (_, res) => {
    res.json({ ok: true, destination: "/" });
  };

  denyUser = (error, req, res, next) => {
    const cxx = Math.floor(err.status / 100);
    if (cxx != 4) return next(error);
    res.json({ ok: false, destination: "/login" });
  };

  logout = (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  };
}

module.exports = { AuthController };
