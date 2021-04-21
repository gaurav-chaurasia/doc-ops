module.exports = {
    "development": {
        'PORT': process.env.PORT || 3000,
        'HOST': process.env.HOST || '127.0.0.1',
        'PYTHON_EXECUTABLE_PATH': process.env.PYTHON_EXECUTABLE_PATH || 'python.exe',
        'DATABASE_URI': process.env.DATABASE_URI,
        'secret': '12345-67890-09876-54321',
        'session': 'IT301',
    },
    "test": {},
    "production": {}
}