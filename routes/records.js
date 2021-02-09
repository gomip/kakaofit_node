// 2021.02.08 | gomip | created

// Initialization
const express = require('express');
const router = express.Router();
const records = require('../model/Record');
const moment = require('moment');

// 개인의 기록 전체 조회
router.get('/:id', function (req, res, next) {
    const id = req.params.id;

    records.find().where('id').equals(id)
        .then(record => {
            console.log('API : GET Records Completed')
            // res.status(200).json({
            //     record: record
            // });
            res.json(record)
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

// 개인의 일주일 정보 조회
router.get('/week/:id/:date', function (req, res, next) {
    const id = req.params.id;
    const date = new Date(req.params.date);

    const first = date.getDate() - date.getDay() + 1
    const last = first + 6;

    const firstDay = moment(new Date(date.setDate(first)).toUTCString()).format('YYYY-MM-DD');      // 오늘 날짜를 포함한 주의 첫째 날 조회
    const lastDay = moment(new Date(date.setDate(last)).toUTCString()).format('YYYY-MM-DD');        // 오늘 날짜를 포함한 주의 마지막 날 조회

    records.find().where('id').equals(id)
        .where('record_date').lte(lastDay)
        .where('record_date').gte(firstDay)
        .sort('record_date')
        .then(record => {
            console.log('API : GET Records by week Completed');
            // res.status(200).json({
            //     record: record
            // });
            res.json(record)
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
})

// 기록 저장
router.post('/:id', function (req, res, next) {
    const id = req.params.id;
    const {record_date, kcal, time} = req.body;

    const postRecord = new records();
    postRecord.id = id;
    postRecord.record_date = record_date;
    postRecord.kcal = kcal;
    postRecord.time = time;

    postRecord.save()
        .then(record => {
            console.log('API : POST Record Completed');
            // res.status(200).json({
            //     record: record
            // });
            res.json(record)
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

module.exports = router;