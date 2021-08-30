// Importando middleware de validação de nível de usuário
const admin = require("./admin.js");

module.exports = app => {

    // Rotas públicas
    app.route("/signUp").post(app.api.users.save);
    app.route("/signIn").post(app.api.auth.signIn);
    app.route("/validateToken").post(app.api.auth.validateToken);

    // Rotas da tabela users
    app.route("/users")
        .all(app.config.passport.authenticate())
        .get(app.api.users.get)
        .post(app.api.users.save);

    app.route("/users/all")
        .all(app.config.passport.authenticate())
        .get(admin(app.api.users.getAll));

    app.route("/users/removed")
        .all(app.config.passport.authenticate())
        .get(admin(app.api.users.getRemoved));

    app.route("/users/restored")
        .all(app.config.passport.authenticate())
        .get(admin(app.api.users.getRestored));

    app.route("/users/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.users.getById)
        .put(app.api.users.save)
        .patch(app.api.users.remove)
        .delete(admin(app.api.users.destroy));

    app.route("/users/:id/restore")
        .all(app.config.passport.authenticate())
        .put(admin(app.api.users.restore));

}