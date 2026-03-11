var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')

// GET all roles
router.get('/', async function (req, res, next) {
    let data = await roleModel.find({
        isDeleted: false
    })
    res.send(data);
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.find({
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

// 4) GET all users by role id
router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;
        let users = await userModel.find({
            isDeleted: false,
            role: id
        }).populate({
            path: 'role',
            select: 'name'
        })
        res.send(users)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

// CREATE role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        })
        await newRole.save();
        res.send(newRole)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// UPDATE role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(
            id, req.body, {
            new: true
        })
        res.send(result)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

// DELETE role (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id)
        result.isDeleted = true;
        await result.save()
        res.send(result)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

module.exports = router;