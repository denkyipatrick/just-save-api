
const BASE_URL = process.env.BASE_URL;
const ROLES_URL = `${BASE_URL}/roles`;
const { Role } = require('../sequelize/models/index');

module.exports = app => {
    app.get(`${ROLES_URL}`, async (req, res) => {
        try {
            res.send(await Role.findAll());
        } catch(error) {
            res.sendStatus(500);
            console.error(error);
        }
    });
}