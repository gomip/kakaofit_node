// 2021.02.08 | gomip | created

// Initialization
const mongoose = require('mongoose');

// Define Schema
const user = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    createdAt: {type: Date}
},{
    timestamps: true
});

// Create Model - kakaofit-user collection에 데이터 저장
module.exports = mongoose.model('user', user, 'kakaofit-user');