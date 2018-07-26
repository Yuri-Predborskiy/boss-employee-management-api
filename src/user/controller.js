const User = require('./model');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const payload = {
        userId: user.id,
        name: user.name,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
}

async function authenticate(req, res) {
    let user = null;
    try {
        user = await User.getByName(req.body.name);
    } catch (err) {
        console.error(err);
        rejectRequest(res, 'Error checking if user exists');
    }

    if (!user || user.password !== req.body.password) {
        rejectRequest(res, 'User with such login/password not found');
    }

    let token = generateAccessToken(user);
    return acceptRequest(res, token);
}

function verifyAccessToken(req, res, next) {
    let token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return rejectRequest(res, 'Failed to authenticate token.');
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return rejectRequest(res, 'Failed to authenticate token.');
    }
}

async function createUser(req, res) {
    let user = null;
    try {
        user = await User.getByName(req.body.name);
    } catch (err) {
        console.error(err);
        rejectRequest(res, 'Error checking if user exists');
    }

    if (user) {
        rejectRequest(res, 'Employee already exists.');
    }

    let boss = null;
    try {
        boss = await User.getByName(req.body.bossName);
    } catch (err) {
        console.error(err);
        rejectRequest('Error getting Boss.');
    }

    if (!boss) {
        rejectRequest(res, 'Boss not found. Every employee needs a boss!');
    }

    try {
        let employee = {
            name: req.body.name,
            password: req.body.password,
            bossId: boss.id,
        };
        await User.create(employee);
    } catch (err) {
        console.error(err);
        rejectRequest(res, 'Error creating new employee');
    }
    return acceptRequest(res, 'User created.')
}

async function getAllUsers(req, res) {
    if (req.decoded.isAdmin) {
        return acceptRequest(res, User.getAll());
    }

    let subordinates = [];
    try {
        subordinates = await User.getAllByBossId(req.decoded.userId);
    } catch (err) {
        console.error(err);
        return rejectRequest(res, 'Error getting users.')
    }
    return acceptRequest(res, 'Users: ' + subordinates.unshift(req.decoded.name).join(', '));
}

async function setBoss(req, res) {
    let employee;
    let boss;
    try {
        employee = await User.getByName(req.body.name);
        boss = await User.getByName(req.body.bossName);
    } catch (err) {
        rejectRequest(res, 'Error getting user.');
    }

    if (!req.decoded.isAdmin && employee.bossId !== req.decoded.userId) {
        rejectRequest(res, 'User can only change boss of their subordinates!');
    }

    let cycle = await hasCycle(employee.id, boss);
    if (cycle) {
        return rejectRequest(res, 'Error: circular dependency detected.')
    }

    return acceptRequest(res, `Updated boss for ${req.body.name}.`);
}

async function hasCycle(employeeId, boss) {
    let bosses = { [boss.id]: true };
    let bossOfBoss = boss;
    while (bossOfBoss.id !== employeeId && bossOfBoss.id !== undefined && bossOfBoss !== null) {
        bossOfBoss = await User.getById(bossOfBoss.bossId);
        if (bosses[bossOfBoss.id]) {
            return true;
        }
        bosses[bossOfBoss.id] = true;
    }
    return false;
}

function rejectRequest(res, message) {
    return res.json({ success: false, message });
}

function acceptRequest(res, message) {
    return res.json({ success: true, message });
}

module.exports = {
    authenticate,
    verifyAccessToken,
    createUser,
    getAllUsers,
    setBoss
};
