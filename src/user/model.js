const db = require('../services/db');

const create = async function (user) {
    const query = 'INSERT INTO employees SET ?';
    return await db.query(query, user);
};

// exclusively for admins
const getAll = async function () {
    const query = 'SELECT id, name, isAdmin, bossId FROM employees';
    return await db.query(query);
};

const getById = async function (id) {
    const query = 'SELECT id, name, isAdmin, bossId FROM employees WHERE id = ?';
    const result = await db.query(query, id);
    if (!result || result.length === 0) {
        return null;
    }
    return result[0];
};

const getByName = async function (name) {
    const query = 'SELECT * FROM employees WHERE name = ?';
    const result = await db.query(query, name);
    if (!result || result.length === 0) {
        return null;
    }
    return result[0];
};

const getAllByBossId = async function(bossId) {
    const query = 'SELECT name FROM employees WHERE bossId = ?';
    return await db.query(query, bossId);
};

const updateUserBossById = async function(id, updates) {
    const query = 'UPDATE employees SET ? WHERE ID = ?';
    return await db.query(query, [updates, id]);
};

module.exports = {
    create,
    getAll,
    getById,
    getByName,
    getAllByBossId,
    updateUserBossById
};
