module.exports = {
    welcome: 'Welcome to API. This message contains route list',
    'POST /register': {
        'request': ['name', 'password', 'bossName'],
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

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm5hbWUiOiJ5dXJpIiwiaXNBZG1pbiI6bnVsbCwiaWF0IjoxNTMyNjIxMTM5fQ.bwOTksiQoIS593Jah18AUj9oEucznHVGf6ecAwni_ZA