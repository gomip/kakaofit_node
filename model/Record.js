// 2021.02.08 | gomip | created

// Initialization
const mongoose = require('mongoose');

// Define Schema
const record = new mongoose.Schema({
    id: {type: Number, required: true},
    record_date: {type: Date, required: true},
    kcal: {type: Number, required: true},
    time: {type: Number, required: true},
    path: {type: String},
},{
    timestamps: true
});

// Create Model - kakaofit-user collection에 데이터 저장
module.exports = mongoose.model('record', record, 'kakaofit-record')