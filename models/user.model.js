const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true },
        password: String,
        password_reset_token: String,
        password_reset_expires: Date,
        email_verification_token: String,
        email_verified: Boolean,

        facebook: String,
        twitter: String,
        google: String,
        github: String,
        instagram: String,
        linkedin: String,
        steam: String,
        tokens: Array,

        profile: {
            name: String,
            gender: String,
            visibility: String,
            theme: String,
            location: String,
            website: String,
            picture: String
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
