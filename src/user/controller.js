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
        return rejectRequest(res, 'Error checking if user exists');
    }

    if (!user || user.password !== req.body.password) {
        return rejectRequest(res, 'User with such login/password not found');
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
        return rejectRequest(res, 'Error checking if user exists');
    }

    if (user) {
        return rejectRequest(res, 'Employee already exists.');
    }

    let boss = null;
    try {
        boss = await User.getByName(req.body.bossName);
    } catch (err) {
        console.error(err);
        return rejectRequest('Error getting Boss.');
    }

    if (!boss) {
        return rejectRequest(res, 'Boss not found. Every employee needs a boss!');
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
        return rejectRequest(res, 'Error creating new employee');
    }
    return acceptRequest(res, 'User created.')
}

async function getAllUsers(req, res) {
    if (req.decoded.isAdmin) {
        return acceptRequest(res, User.getAll());
    }

    let subordinates = [req.decoded.name];
    try {
        let users = await User.getAllByBossId(req.decoded.userId);
        users = users.map(user => user.name);
        subordinates = subordinates.concat(users);
    } catch (err) {
        console.error(err);
        return rejectRequest(res, 'Error getting users.')
    }
    return acceptRequest(res, 'Employees: ' + subordinates.join(', '));
}

async function setBoss(req, res) {
    let employee;
    let boss;
    try {
        employee = await User.getByName(req.body.name);
        boss = await User.getByName(req.body.bossName);
    } catch (err) {
        return rejectRequest(res, 'Error getting user.');
    }

    if (!req.body.name
        || !req.body.bossName
        || req.body.name === req.body.bossName
        || employee.bossId === boss.id
    ) {
        return rejectRequest(res, 'Invalid parameters.');
    }

    if (!req.decoded.isAdmin && employee.bossId !== req.decoded.userId) {
        return rejectRequest(res, 'User can only change boss of their subordinates!');
    }

    let cycle = await hasCycle(employee.id, boss);
    if (cycle) {
        return rejectRequest(res, 'Error: circular dependency detected.')
    }

    await User.updateUserBossById(employee.id, { bossId: boss.id });
    return acceptRequest(res, `Updated boss for ${req.body.name}.`);
}

async function hasCycle(employeeId, boss) {
    let bosses = { [boss.id]: true };
    let bossOfBoss = boss;
    while (bossOfBoss.bossId !== undefined && bossOfBoss.bossId !== null) {
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
