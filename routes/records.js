// 2021.02.08 | gomip | created

// Initialization
const express = require('express');
const router = express.Router();
const records = require('../model/Record');
const moment = require('moment');

const multer = require('multer');
const multerS3 = require('multer-s3');

// S3
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname+"/../awsconfig.json");
let s3 = new aws.S3();

// upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: (req, res, cb) => {
            cb(null,'kakaofit/' + req.params.id + '/' + moment(new Date(req.body.record_date)).year() + '/' + (moment(new Date(req.body.record_date)).month()+1));
        }, // 버킷 이름
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
        acl: 'public-read',
        key: function (req, file, cb) {
            let filename = file.originalname;
            cb(null, filename);
        }
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});


router.post('/upload', upload.single("imgFile"), function(req, res, next) {
    let imgFile = req.file;
    res.json(imgFile);
})

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
    const date2 = new Date(req.params.date);
    const first = date2.getDate() - date2.getDay() + (date.getDay() === 0 ? -6 : 1);
    const last = first + 6;

    const firstDay = moment(new Date(date.setDate(first)).toUTCString()).format('YYYY-MM-DD');      // 오늘 날짜를 포함한 주의 첫째 날 조회
    const lastDay = moment(new Date(date.setDate(last)).toUTCString()).add(1,'day').format('YYYY-MM-DD');        // 오늘 날짜를 포함한 주의 마지막 날 조회

    records.find().where('id').equals(id)
        .where('record_date').lt(lastDay)
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
});

// 기록 저장
// router.post('/:id', upload.single("imgFile"), function (req, res, next) {
router.post('/:id', function (req, res, next) {
    const id = req.params.id;
    const {record_date, kcal, time, path} = req.body;

    const year =  moment(new Date(req.body.record_date)).year();
    const month =  moment(new Date(req.body.record_date)).month() + 1;

    const postRecord = new records();
    postRecord.id = id;
    postRecord.record_date = moment(new Date(record_date)).format('YYYY-MM-DD');
    postRecord.kcal = kcal;
    postRecord.time = time;
    // postRecord.path = 'https://kakaofit.s3.ap-northeast-2.amazonaws.com/'+ id + '/' + year  + '/' + month + '/' + req.file.originalname;
    postRecord.path = path;

    console.log('postRecord', postRecord);
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