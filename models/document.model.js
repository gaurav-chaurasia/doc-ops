const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
        name: { type: String, unique: true, index: true },
        client_ip: String,
    },
    { timestamps: true },
);

module.exports = mongoose.model('Document', documentSchema);
