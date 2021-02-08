// 2021.02.08 | gomip | created

// Initialization
const express = require('express');
const router = express.Router();
const users = require('../model/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
    users.find()
        .then(user => {
            console.log('API : GET Completed');
            res.status(200).json({
                message: 'API : GET Completed',
                data: {
                    user: user
                }
            });
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

// 사용자 등록
router.post('/', function (req, res, next) {
    const {id, name} = req.body;

    const postUser = new users();
    postUser.id = id;
    postUser.name = name;
    postUser.createdAt = Date.now();

    postUser.save()
        .then(data => {
            console.log('API : POST Completed');
            res.status(200).json({
                message: "'API : POST Completed',",
                data: {
                    user: data
                }
            });
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

module.exports = router;