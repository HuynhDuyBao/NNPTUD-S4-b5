var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

// 1) GET all users - query theo username (includes)
router.get('/', async function (req, res, next) {
    let usernameQ = req.query.username ? req.query.username : '';
    let data = await userModel.find({
        isDeleted: false,
        username: new RegExp(usernameQ, 'i')
    }).populate({
        path: 'role',
        select: 'name'
    })
    res.send(data);
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.find({
            isDeleted: false,
            _id: id
        })
        if (result.length > 0) {
            res.send(result[0])
        } else {
            res.status(404).send("ID NOT FOUND")
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
});

// CREATE user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        })
        await newUser.save();
        res.send(newUser)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// 2) POST /enable - truyền email và username, nếu đúng thì status = true
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        })
        if (user) {
            user.status = true;
            await user.save();
            res.send(user)
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// 3) POST /disable - truyền email và username, nếu đúng thì status = false
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        })
        if (user) {
            user.status = false;
            await user.save();
            res.send(user)
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// UPDATE user
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(
            id, req.body, {
            new: true
        })
        res.send(result)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id)
        result.isDeleted = true;
        await result.save()
        res.send(result)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

module.exports = router;