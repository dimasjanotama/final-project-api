const db = require('../database')
var nodemailer = require('nodemailer')
var multer = require('multer')



let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ammoth77@gmail.com',
        pass: 'invhlgwbrbwujsqj'
    },
    tls: {
        rejectUnauthorized: false 
    }
})

module.exports = {

    getuser: (req,res)=>{
        db.query(`select * from users where username ='${req.query.username}' or email ='${req.query.email}'`,(err,result)=>{
            if(err) throw err
            res.send(result)
            })
        },
    
    getuserbyid: (req,res)=>{
        db.query(`select * from users where id ='${req.query.userid}'`,(err,result)=>{
            if(err) throw err
            res.send(result)
            })
        },

    getcart: (req,res)=>{
        db.query(`select * from carts where idBuyer ='${req.query.idBuyer}'`,(err,result)=>{
            if(err) throw err
            res.send(result)
            })
        },

    login: (req,res)=>{
    db.query(`select * from users where username ='${req.query.username}'`,(err,result)=>{
        if(err) throw err
        if(result.length>0){
            if (req.query.password === result[0].password){
                res.send({
                    status: '200',
                    message: 'Selamat, anda berhasil login',
                    result: result
                })
            } else {
                res.send({
                    status: '401',
                    message: 'Password yang anda masukkan salah'
                })
            }
        } else {
            res.send({
                status: '404',
                message: `Username ${req.query.username} tidak ditemukan`
            })
        }
        })
    },

    register: (req,res)=>{
        let sql = `insert into users (id, username, email, password, namaDepan, namaBelakang, alamat, kelurahan, kecamatan, kabupaten, propinsi, kodepos, isVerified) 
        values (0, '${req.body.username}', '${req.body.email}', '${req.body.password}', '${req.body.namaDepan}', '${req.body.namaBelakang}', '${req.body.alamat}',
        '${req.body.kelurahan}', '${req.body.kecamatan}', '${req.body.kabupaten}', '${req.body.propinsi}', '${req.body.kodepos}', 0)`
    db.query(sql, (err,result)=>{
        if(err) throw err
        let mailOptions = {
            from: 'Fxpedia',
            to: req.body.email,
            subject: 'Email Verifikasi Akun Fxpedia',
            html: `<p> <a href="http://localhost:7777/auth/verify?username=${req.body.username}&email=${req.body.email}">Klik disini</a> untuk verifikasi akun Fxpedia anda</p>`
        }
        transporter.sendMail(mailOptions, (err2, info)=>{
            if(err2) throw err2
        })
        res.send({
            status: '201',
            message: `Berhasil registrasi, Silahkan cek email anda untuk verifikasi akun`
        })
        })
    },

    verify: (req,res)=>{
        let sql = `update users set isVerified = 1 where username = '${req.query.username}' and email = '${req.query.email}'`
        db.query(sql, (err,result)=>{
        if(err) throw err
           res.send( `Berhasil verifikasi, Selamat! Akun anda sudah terdaftar
            Klik <a href="http://localhost:3000/login">disini</a> untuk kembali ke halaman login`)
        })
        },

    uploadproduct: (req,res) => {
        let data = JSON.parse(req.body.data)
        
        let sql = `insert into products values (0, '${data.idUser}', '${data.propinsiUser}','${data.namaProduk}', '${data.kategori}', 
        '${data.subKategori}', '${data.harga}', '${data.berat}', '${data.kondisi}', '${data.deskripsi}', 
        '${req.file.filename}', '${data.qty}')`
        try {
            // if(req.validation) throw req.validation
            // if(req.file.size>5) throw {error: true, message: 'Image size too large'}
            db.query(sql, (err, result) => {
                if (err) throw err
                res.send(result)
            })   
        } catch (error) {
            fs.unlinkSync(req.file.path)
            console.log(error);
        }
    },

    editproduct: (req,res) => {
        let data = JSON.parse(req.body.data)
        let sql = `UPDATE products SET namaProduk='${data.namaProduk}', propinsiUser='${data.propinsiUser}',kategori='${data.kategori}', 
        subKategori='${data.subKategori}', harga='${data.harga}', berat='${data.berat}', kondisi='${data.kondisi}', deskripsi='${data.deskripsi}', 
        fotoProduk='${req.file.filename}', qty='${data.qty}' WHERE id=${data.id}`
        try {
            // if(req.validation) throw req.validation
            // if(req.file.size>5) throw {error: true, message: 'Image size too large'}
            db.query(sql, (err, result) => {
                if (err) throw err
                res.send(result)
            })   
        } catch (error) {
            fs.unlinkSync(req.file.path)
            console.log(error);
        }
    },

    getproduct : (req, res)=>{
        let sql = `SELECT * FROM products WHERE idUser='${req.query.userid}'`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    
    countproducts : (req, res)=>{
        let sql = `SELECT COUNT(*) AS totalitem FROM products WHERE idUser='${req.query.userid}'`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    countfilterproducts : (req, res)=>{
        let sql= `SELECT COUNT(*) AS totalitem FROM products`
        let {query} = req
        if(query){            
            sql += ` WHERE`
            if(query.namaProduk){
                sql += ` namaProduk LIKE '%${query.namaProduk}%' AND`
            }
            if(query.hargamax && query.hargamin) {
                sql += ` harga <= ${query.hargamax} AND ${query.hargamin} <= harga AND`
            }
            if(query.kategori){
                sql += ` kategori = '${query.kategori}' AND`
            }
            if(query.subKategori){
                sql += ` subKategori = '${query.subKategori}' AND`
            }
            if(query.kondisi){
                sql += ` kondisi = '${query.kondisi}' AND`
            }
            if(query.userid){
                sql += ` idUser != '${query.userid}' AND`
            }
        } 
        db.query(sql.slice(0, -4), (err,result)=>{
            try {
                if (err) throw err
                res.send(result)
            } catch (err) {
                console.log(err);
            }
        })  
    },

    paginationfilterproducts : (req, res)=>{
        let sql= `SELECT * FROM products`
        let {query} = req
        if(query){
            sql += ` WHERE`
            if(query.namaProduk){
                sql += ` namaProduk LIKE '%${query.namaProduk}%' AND`
            }
            if(query.hargamax && query.hargamin) {
                sql += ` harga <= ${query.hargamax} AND ${query.hargamin} <= harga AND`
            }
            if(query.kategori){
                sql += ` kategori = '${query.kategori}' AND`
            }
            if(query.subKategori){
                sql += ` subKategori = '${query.subKategori}' AND`
            }
            if(query.kondisi){
                sql += ` kondisi = '${query.kondisi}' AND`
            }
            if(query.userid){
                sql += ` idUser != '${query.userid}' AND`
            }
        } 
        let sql2 = sql.slice(0, -4)
        let sql3 = ` LIMIT ${query.indexke},10`
        let sql4 = sql2 + sql3
        db.query(sql4, (err,result)=>{
            try {
                if (err) throw err
                res.send(result)
            } catch (err) {
                console.log(err);
            }
        })  
    },

    paginationproducts : (req, res)=>{
        let sql = `SELECT * FROM products WHERE idUser='${req.query.userid}' LIMIT ${req.query.indexke},10`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getproductbyid : (req, res)=>{
        let sql = `SELECT * FROM products WHERE idUser='${req.query.userid}' AND id=${req.query.idproduct}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getproductsearch : (req, res)=>{
        let sql = `SELECT * FROM products WHERE id=${req.query.idproduct}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    deleteproduct : (req, res)=>{
        console.log(req);
        try {
            db.query(`DELETE FROM products WHERE id=${req.body.id}`, (err, result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }
    },

    deletecart : (req, res)=>{
        console.log(req);
        try {
            db.query(`DELETE FROM carts WHERE id=${req.body.idCart}`, (err, result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }
    },

    addtocart: (req,res)=>{
        console.log(req.body)
        let sql = `INSERT INTO carts VALUES (0, '${req.body.idProduct}', '${req.body.idBuyer}', '${req.body.idSeller}', '${req.body.propinsiBuyer}', 
        '${req.body.propinsiSeller}','${req.body.namaProduk}', '${req.body.harga}', '${req.body.berat}', '${req.body.orderQty}', '${req.body.fotoProduk}')`
        let sql2 = `UPDATE products SET qty = ${req.body.qty}-${req.body.orderQty} WHERE id = '${req.body.idProduct}'`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                try {
                    db.query(sql2, (err,result)=>{
                        if (err) throw err
                        res.send('Success ATC')       
                    })
                } catch (error) {
                    console.log(error);
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    cekqty: (req,res)=>{
        let sql = `SELECT COUNT(*) AS sudahada, orderQty FROM carts WHERE idProduct ='${req.query.idProduct}' AND idBuyer='${req.query.idBuyer}'`
        try {
            db.query(sql ,(err,result)=>{
                if(err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    addqty: (req,res)=>{
        let sql = `UPDATE carts SET orderQty = ${req.body.orderQtyNow} WHERE idProduct = '${req.body.idProduct}'`
        let sql2 = `UPDATE products SET qty = qty-${req.body.orderQty} WHERE id = '${req.body.idProduct}'`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                try {
                    db.query(sql2, (err,result)=>{
                        if (err) throw err
                        res.send('Success ATC')       
                    })
                } catch (error) {
                    console.log(error);
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
}