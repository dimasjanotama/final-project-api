var express = require('express')
var router = express.Router()
const { authController } = require('../1.controllers')
var multer = require('multer')

router.get('/login', authController.login)

router.get('/getuser', authController.getuser)

router.get('/getcart', authController.getcart)

router.get('/getuserbyid', authController.getuserbyid)

router.post('/register', authController.register)

router.post('/postdataseller', authController.postdataseller)

router.get('/verify', authController.verify)

router.get('/getproduct', authController.getproduct)

router.get('/countproducts', authController.countproducts)

router.get('/countfilterproducts', authController.countfilterproducts)

router.get('/paginationproducts', authController.paginationproducts)

router.get('/paginationfilterproducts', authController.paginationfilterproducts)

router.get('/getproductbyid', authController.getproductbyid)

router.get('/getproductsearch', authController.getproductsearch)

router.delete('/deleteproduct', authController.deleteproduct)

router.post('/addtocart', authController.addtocart)

router.delete('/deletecart', authController.deletecart)

router.delete('/deletecartbyuserid', authController.deletecartbyuserid)

router.put('/addqty', authController.addqty)

router.get('/cekqty', authController.cekqty)

router.post('/addorder', authController.addorder)

router.post('/addtransaction', authController.addtransaction)

router.post('/addhistory', authController.addhistory)

router.get('/gettransaction', authController.gettransaction)

router.get('/gettransactionbuy', authController.gettransactionbuy)

router.get('/getalltransactions', authController.getalltransactions)

router.get('/getunverifiedtransaction', authController.getunverifiedtransaction)

router.get('/getverifiedtransaction', authController.getverifiedtransaction)

router.get('/gettransactionorder', authController.gettransactionorder)

router.get('/getunpaidverification', authController.getunpaidverification)

router.put('/paymentverification', authController.paymentverification)

router.put('/rejectverification', authController.rejectverification)

router.put('/shippingverification', authController.shippingverification)

router.put('/rejectshippingverification', authController.rejectshippingverification)

router.put('/transactiondone', authController.transactiondone)

router.delete('/deletetransaction', authController.deletetransaction)

router.get('/getshippingverification', authController.getshippingverification)

router.put('/receivepacket', authController.receivepacket)

router.put('/feedbackpositif', authController.feedbackpositif)

router.put('/feedbacknegatif', authController.feedbacknegatif)

router.put('/updateprofile', authController.updateprofile)

router.get('/getorderlist', authController.getorderlist)

router.get('/getorderbuy', authController.getorderbuy)

router.get('/gethistory', authController.gethistory)

router.get('/getdataseller', authController.getdataseller)

router.get('/getproductsold', authController.getproductsold)

router.get('/gettotalproduct', authController.gettotalproduct)

router.get('/gettransactiondetail', authController.gettransactiondetail)


// ---------------------------- MULTER -------------------------------------
let multerStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },

    filename: (req, file, cb) => {
        cb(null, `PRD-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
})

let filterConfig = (req, file, cb) => {
    if(file.mimetype.split('/')[1] == 'png' || file.mimetype.split('/')[1] == 'jpeg'){
        cb(null, true)
    } else {
        req.validation = {error : true, msg : 'File must be an image'}
        cb(null, false)
    } 
}

let upload = multer({
    storage: multerStorageConfig,
    fileFilter: filterConfig
})

router.post('/uploadproduct', upload.single('aneh'), authController.uploadproduct) 

router.post('/editproduct', upload.single('anehedit'), authController.editproduct) 

router.post('/paymentconfirm', upload.single('anehkonfirmasi'), authController.paymentconfirm) 

router.post('/shippingconfirm', upload.single('anehshipping'), authController.shippingconfirm) 

router.post('/updatefoto', upload.single('anehfoto'), authController.updatefoto) 

module.exports = router