class AdminController {
  dashboard(req, res, next) {
    res.render("admin/dashboard", { user: req.user });
  }
}

module.exports = AdminController;
