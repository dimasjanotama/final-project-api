var express = require('express')
var router = express.Router()
const { authController } = require('../1.controllers')
const { gettoken, verifytoken } = require('../3.helper/jwt')
var multer = require('multer')

router.post('/gettoken', gettoken)

router.get('/login', authController.login)

router.get('/getuser', authController.getuser)

router.get('/getcart', verifytoken, authController.getcart)

router.get('/getuserbyid', verifytoken, authController.getuserbyid)

router.post('/register', authController.register)

router.post('/postdataseller', authController.postdataseller)

router.get('/verify', verifytoken, authController.verify)

router.get('/getproduct', verifytoken, authController.getproduct)

router.get('/getnewestproduct', verifytoken, authController.getnewestproduct)

router.get('/countproducts', verifytoken, authController.countproducts)

router.get('/countfilterproducts', verifytoken, authController.countfilterproducts)

router.get('/paginationproducts', verifytoken, authController.paginationproducts)

router.get('/paginationfilterproducts', verifytoken, authController.paginationfilterproducts)

router.get('/getproductbyid', verifytoken, authController.getproductbyid)

router.get('/getproductsearch', verifytoken, authController.getproductsearch)

router.delete('/deleteproduct', authController.deleteproduct)

router.post('/addtocart', authController.addtocart)

router.delete('/deletecart', authController.deletecart)

router.delete('/deletecartbyuserid', authController.deletecartbyuserid)

router.put('/addqty', authController.addqty)

router.get('/cekqty', authController.cekqty)

router.post('/addorder', authController.addorder)

router.post('/addtransaction', authController.addtransaction)

router.post('/addhistory', authController.addhistory)

router.get('/gettransaction', verifytoken, authController.gettransaction)

router.get('/gettransactionbuy', verifytoken, authController.gettransactionbuy)

router.get('/getalltransactions', verifytoken, authController.getalltransactions)

router.get('/getunverifiedtransaction', verifytoken, authController.getunverifiedtransaction)

router.get('/getverifiedtransaction', verifytoken, authController.getverifiedtransaction)

router.get('/gettransactionorder', verifytoken, authController.gettransactionorder)

router.get('/getunpaidverification', verifytoken, authController.getunpaidverification)

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

router.put('/setlogtime', authController.setlogtime)

router.get('/getorderlist', verifytoken, authController.getorderlist)

router.get('/getorderbuy', verifytoken, authController.getorderbuy)

router.get('/gethistory', verifytoken, authController.gethistory)

router.get('/getdataseller', verifytoken, authController.getdataseller)

router.get('/getproductsold', verifytoken, authController.getproductsold)

router.get('/gettotalproduct', verifytoken, authController.gettotalproduct)

router.get('/gettransactiondetail', verifytoken, authController.gettransactiondetail)

router.put('/transactiontimeout', authController.transactiontimeout)

router.put('/refreshquantity', authController.refreshquantity)

router.put('/rejectquantity', authController.rejectquantity)

router.get('/totaltransactionbuy', verifytoken, authController.totaltransactionbuy)

router.get('/totalproductnow', verifytoken, authController.totalproductnow)

router.get('/totalproductsold', verifytoken, authController.totalproductsold)

router.get('/mostwantedproduct', verifytoken, authController.mostwantedproduct)

router.get('/getsellchart', verifytoken, authController.getsellchart)

router.get('/getbuychart', verifytoken, authController.getbuychart)

router.get('/gettotalsell', verifytoken, authController.gettotalsell)

router.get('/gettotalbuy', verifytoken, authController.gettotalbuy)

router.get('/getuserschart', verifytoken, authController.getuserschart)

router.get('/gettotalusers', verifytoken, authController.gettotalusers)

router.get('/transactiondonechart', verifytoken, authController.transactiondonechart)

router.get('/totaltransactiondone', verifytoken, authController.totaltransactiondone)

router.get('/transactionvaluechart', verifytoken, authController.transactionvaluechart)

router.get('/totaltransactionvalue', verifytoken, authController.totaltransactionvalue)

router.get('/transactionstatuschart', verifytoken, authController.transactionstatuschart)

router.get('/custsatisfactionchart', verifytoken, authController.custsatisfactionchart)

router.get('/productschart', verifytoken, authController.productschart)

router.get('/activeseller', verifytoken, authController.activeseller)

router.get('/activebuyer', verifytoken, authController.activebuyer)


// ---------------------------- HTML-PDF ----------------------------------

router.get('/downloadhistory', authController.downloadhistory)

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