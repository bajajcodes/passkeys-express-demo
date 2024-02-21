class AuthController {
  register = (_, res) => {
    res.render("auth/register");
  };

  login = (_, res) => {
    res.render("auth/login");
  };
}

module.exports = { AuthController };
