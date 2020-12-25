const express = require('express');
const router = express.Router();
const multer = require('multer');

const { Product } = require('../models/Product');


//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})
var upload = multer({ storage: storage }).single("files");


//TODO: 이미지 업로드 시에 이미지 저장 
router.post('/image', (req, res) => {

  // 가져온 이미지를 저장을 해주면 된다. 
  upload(req,res,err => {
    if(err) {
      return res.json({success: false, err})
    }
    return res.json({ success: true, filePath:res.req.file.path , fileName: res.req.file.filename})
  })
})

//TODO: 상품 업로드 
router.post('/', (req, res) => {

  // 받아온 정보들을 DB에 넣어 준다.
  const product = new Product(req.body);

  product.save((err) => {
    if(err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  });
  
})


//TODO: 모든 상품 가져오기 
router.post('/products', (req, res) => {

  // Product collection에 들어 있는 모든 상품 정보를 가져오기 

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for(let key in req.body.filters) {
    if(req.body.filters[key].length > 0) {

      if(key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],   // greater than equal 
          $lte: req.body.filters[key][1]    // less than equal 
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if(term) {
    Product.find(findArgs)
    .find({ "title": {'$regex': term }})   // .find({ $text: { $search: term } })  .find({ "title": {'$regex': term }})
    .populate("writer")   // writer에 대한 모든 정보를 가져올 수 있다. 
    .skip(skip)
    .limit(limit)
    .exec((err, productsInfo) => {
      if(err) return res.status(400).json({ success: false , err})
      return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length })
    }) 
  } else {
    Product.find(findArgs)
    .populate("writer")   // writer에 대한 모든 정보를 가져올 수 있다. 
    .skip(skip)
    .limit(limit)
    .exec((err, productsInfo) => {
      if(err) return res.status(400).json({ success: false , err})
      return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length })
    }) 
  } 


  
})



module.exports = router;
