'use strict';

const bcryptjs = require('bcryptjs');
const { NewStaff, StaffBranch, StaffRole, sequelize } = require('../../sequelize/models/index');

module.exports = class CreateStaffController {
    static async create(req, res) {
        console.log(req.body);
        const sequelizeTransaction = await sequelize.transaction();

        try {
            const staff = await NewStaff.create({
                companyId: req.body.companyId,
                lastName: req.body.lastName,
                username: req.body.username,
                firstName: req.body.firstName,
                password: bcryptjs.hashSync(req.body.password, 10),
            }, { transaction: sequelizeTransaction });

            await StaffBranch.create({
                staffId: staff.id,
                branchId: req.body.branchId
            }, { transaction: sequelizeTransaction });

            await StaffRole.create({
                staffId: staff.id,
                roleId: 'view-product',
            }, { transaction: sequelizeTransaction });

            res.status(201).send(staff);
            sequelizeTransaction.commit();
        } catch (error) {
            sequelizeTransaction.rollback();
            res.sendStatus(500);
            console.error(error);
        }
    }
}