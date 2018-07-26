module.exports = {
    welcome: 'Welcome to API. This message contains route list',
    'POST /register': {
        'request': ['name', 'password', 'bossName', 'isAdmin (optional, default: false)'],
        'response': ['success: boolean', 'message']
    },
    'POST /login': {
        'request': ['name', 'password'],
        'response': ['success: boolean', 'message: access token']
    },
    'GET /users': {
        'request (headers)': ['token'],
        'response': ['success: boolean', 'message: employee list (current user, subordinates)']
    },
    'POST /setBoss': {
        'request': ['name', 'bossName'],
        'response': ['success: boolean', 'message: error (in case of fail)']
    }
};