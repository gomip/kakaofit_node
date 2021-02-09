// 2021.02.08 | gomip | created

// Initialization
const express = require('express');
const router = express.Router();
const users = require('../model/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
    users.find()
        .then(user => {
            console.log('API : GET User Completed');
            // res.status(200).json({
            //     user: user
            // });
            res.json(user)
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
        .then(user => {
            console.log('API : POST User Completed');
            // res.status(200).json({
            //     user: user
            // });
            res.json(user)
        }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

module.exports = router;