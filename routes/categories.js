var express = require('express');
var router = express.Router();
//let { dataCategories, dataProducts } = require('../utils/data')
let slugify = require('slugify');
let { GenID } = require('../utils/idHandler')
let categoryContext = require('../schemas/categories')

//R CUD
/* GET users listing. */
router.get('/', async function (req, res, next) {
  let data = await categoryContext.find({
    isDeleted: false
  })
  // let result = data.filter(
  //   function (e) {
  //     return !e.isDeleted;
  //   }
  // )
  res.send(data);
});
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await categoryContext.find({
      isDeleted: false,
      _id: id
    })
    if (result.length > 0) {
      res.send(result[0])
    }else{
      res.status(404).send("ID NOT FOUND")
    }

  } catch (error) {
    res.status(404).send(error.message)
  }

  // if (result.length == 0) {
  //   res.status(404).send({
  //     message: "ID NOT FOUND"
  //   });
  // } else {
  //   res.send(result[0])
  // }
});
router.get('/:id/products', function (req, res, next) {
  let id = req.params.id;
  let resultCategory = dataCategories.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (resultCategory.length == 0) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  } else {
    let result = dataProducts.filter(
      function (e) {
        return e.category.id == id
      }
    )
    res.send(result)
  }
});
router.post('/', async function (req, res, next) {
  let newCate = new categoryContext({
    name: req.body.name,
    slug: slugify(req.body.name,
      {
        replacement: '-',
        remove: undefined,
        lower: true,
        trim: true
      }
    ),
    image: req.body.image
  })
  await newCate.save();
  res.send(newCate)
})
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await categoryContext.findById(id)
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (result[key]) {
        result[key] = req.body[key]
        result.updatedAt = new Date(Date.now())
      }
    }
    await result.save()
    res.send(result)
  } catch (error) {
    res.status(404).send(error.message)
  }
})
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await categoryContext.findById(id)
    result.isDeleted = true;
    await result.save()
    res.send(result)
  } catch (error) {
    res.status(404).send(error.message)
  }
})



module.exports = router;
