class AuthController {
  register(req, res, next) {
    res.render("auth/register");
  }

  login(req, res, next) {
    res.render("auth/login");
  }
}

module.exports = AuthController;
