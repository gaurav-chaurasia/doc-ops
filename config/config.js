module.exports = {
    "development": {
        'PORT': process.env.PORT || 3000,
        'HOST': process.env.HOST || '127.0.0.1',
        'PYTHON_EXECUTABLE_PATH': process.env.PYTHON_EXECUTABLE_PATH || 'python.exe',
        'DATABASE_URI': process.env.DATABASE_URI,
        'secret': '12345-67890-09876-54321',
        'session': 'IT301',
        'GOOGLE_OAUTH2_CLIENT_ID': process.env.GOOGLE_OAUTH2_CLIENT_ID,
        'GOOGLE_OAUTH2_CLIENT_SECRET': process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
        'GOOGLE_CALLBACK_URL': 'http://localhost:3000/auth/google/callback'
    },
    "test": {},
    "production": {}
}