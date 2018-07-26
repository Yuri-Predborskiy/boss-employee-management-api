module.exports = 'API routes:\n' +
    'POST /register - send fields: string email, string password, number bossId\n' +
    'POST /login - send fields: email, password; reply will contain token if login in a success\n' +
    'following routes require access token:\n' +
    'GET /users - returns a list of users - user themselves + subordinates (users whose boss is current user)\n' +
    'POST /setBoss - send fields: userId, bossId; reply: success or fail depending on logic';