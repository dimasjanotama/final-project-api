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
        try {
            db.query(`select * from users where username ='${req.query.username}' or email ='${req.query.email}'`,(err,result)=>{
                if(err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }    
    },
    
    
    getuserbyid: (req,res)=>{
        try {
            db.query(`select * from users where id ='${req.query.userid}'`,(err,result)=>{
                if(err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }    
    },

    getcart: (req,res)=>{
        try {
            db.query(`select * from carts where idBuyer ='${req.query.idBuyer}'`,(err,result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }    
    },

    login: (req,res)=>{
        try {
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
        } catch (error) {
            console.log(error);
        }
    },

    register: (req,res)=>{
        let sql = `insert into users (id, username, email, password, namaDepan, namaBelakang, noTelp, alamat, kelurahan, kecamatan, kabupaten, 
        propinsi, pulau, kodepos, tglDaftar, isVerified) values (0, '${req.body.username}', '${req.body.email}', '${req.body.password}', 
        '${req.body.namaDepan}', '${req.body.namaBelakang}', '${req.body.noTelp}', '${req.body.alamat}', '${req.body.kelurahan}', '${req.body.kecamatan}', 
        '${req.body.kabupaten}', '${req.body.propinsi}', '${req.body.pulau}', '${req.body.kodepos}', '${req.body.tglDaftar}', 0)`
        try {
            db.query(sql, (err,result)=>{
                if(err) throw err
                let mailOptions = {
                    from: 'Fxpedia',
                    to: req.body.email,
                    subject: 'Email Verifikasi Akun Fxpedia',
                    html: `<p> <a href="http://localhost:7777/auth/verify?username=${req.body.username}&email=${req.body.email}">Klik disini</a> untuk verifikasi akun Fxpedia anda</p>`
                }
                try {
                    transporter.sendMail(mailOptions, (err2, info)=>{
                        if(err2) throw err2
                    })
                    res.send({
                        status: '201',
                        message: `Berhasil registrasi, Silahkan cek email anda untuk verifikasi akun`
                    })
                } catch (error) {
                    console.log(error);
                }
                })
        } catch (error) {
            console.log(error);
        }
    },

    postdataseller: (req,res)=>{
        let sql = `INSERT INTO dataseller (idSeller) VALUES ('${req.body.idSeller}')`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send('berhasil')
            })
        } catch (error) {
            console.log(error);
        }
    },

    verify: (req,res)=>{
        let sql = `update users set isVerified = 1 where username = '${req.query.username}' and email = '${req.query.email}'`
        try {
            db.query(sql, (err,result)=>{
                if(err) throw err
                   res.send( `Berhasil verifikasi, Selamat! Akun anda sudah terdaftar
                    Klik <a href="http://localhost:3000/login">disini</a> untuk kembali ke halaman login`)
                })
        } catch (error) {
            console.log(error); 
        }
    },

    uploadproduct: (req,res) => {
        let data = JSON.parse(req.body.data)
        
        let sql = `insert into products values (0, '${data.idUser}', '${data.namaSeller}', '${data.pulauUser}','${data.namaProduk}', '${data.kategori}', 
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
        let sql=`DELETE FROM carts WHERE id=${req.body.idCart}` 
        let sql2=`DELETE FROM orders WHERE idBuyer=${req.body.idBuyer} ORDER BY id DESC LIMIT 1` 
        try {
            db.query(sql, (err, result)=>{
                if(err) throw err
                try {
                    db.query(sql2, (err, result)=>{
                        if(err) throw err
                        res.send(result)
                    })    
                } catch (error) {
                    console.log(error);
                }
            })    
        } catch (error) {
            console.log(error);
        }
    },

    deletecartbyuserid : (req, res)=>{
        try {
            db.query(`DELETE FROM carts WHERE idBuyer=${req.body.idBuyer}`, (err, result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }
    },

    addtocart: (req,res)=>{
        let sql = `INSERT INTO carts VALUES (0, '${req.body.idProduct}', '${req.body.idBuyer}', '${req.body.idSeller}', '${req.body.namaSeller}', 
        '${req.body.pulauBuyer}', '${req.body.pulauSeller}','${req.body.namaProduk}', '${req.body.harga}', '${req.body.berat}', 
        '${req.body.orderQty}', '${req.body.fotoProduk}')`
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

    addtransaction: (req,res)=>{
        let sql = `INSERT INTO transactions (id, tglPembelian, tglExpired, idBuyer, namaBuyer, idSeller, namaSeller, nilaiTransaksi, statusNow, ket) 
        VALUES (0, '${req.body.tglPembelian}', '${req.body.tglExpired}', '${req.body.idBuyer}', '${req.body.namaBuyer}', '${req.body.idSeller}', 
        '${req.body.namaSeller}', '${req.body.nilaiTransaksi}', 'Menunggu pembayaran', 'Lanjut')`

        let sql2= `UPDATE orders SET idTransaction=(SELECT transactions.id FROM transactions WHERE idBuyer=${req.body.idBuyer} ORDER BY id DESC LIMIT 1) 
        WHERE idBuyer='${req.body.idBuyer}'` 

        let sql3= `INSERT INTO alltransactions (id, tglPembelian, tglExpired, idBuyer, namaBuyer, idSeller, namaSeller, nilaiTransaksi, statusNow, ket) 
        VALUES (0, '${req.body.tglPembelian}', '${req.body.tglExpired}', '${req.body.idBuyer}', '${req.body.namaBuyer}', '${req.body.idSeller}', 
        '${req.body.namaSeller}', '${req.body.nilaiTransaksi}', 'Menunggu pembayaran', 'Lanjut')`
        
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                try {
                    db.query(sql2, (err,result)=>{
                        if (err) throw err
                        try {
                            db.query(sql3, (err,result)=>{
                                if (err) throw err
                                res.send('berhasil cekout')
                            })
                        } catch (error) {
                            console.log(error);
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    addorder: (req,res)=>{
        let sql = `INSERT INTO orders VALUES (0, '${req.body.idBuyer}', '${req.body.namaBuyer}', '${req.body.alamat}', '${req.body.kelurahan}',
        '${req.body.kecamatan}', '${req.body.kabupaten}', '${req.body.propinsi}', '${req.body.kodepos}', '${req.body.pulauBuyer}', '${req.body.idSeller}', 
        '${req.body.namaSeller}', '${req.body.pulauSeller}', 0, '${req.body.idProduct}', '${req.body.namaProduk}', '${req.body.berat}', 
        '${req.body.orderQty}', '${req.body.harga}', '${req.body.fotoProduk}', 0, 0, 0 )`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send('berhasil add order')
            })
        } catch (error) {
            console.log(error);
        }
    },

    addhistory: (req,res)=>{
        let sql = `INSERT INTO history VALUES (0, '${req.body.idTransaction}', '${req.body.tglPenerimaan}', '${req.body.idBuyer}', '${req.body.namaBuyer}',
        '${req.body.idSeller}', '${req.body.namaSeller}', ${req.body.nilaiTransaksi}, '${req.body.hakSeller}', '${req.body.hakBuyer}', 'Done')`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send('berhasil')
            })
        } catch (error) {
            console.log(error);
        }
    },

    gettransaction : (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE idBuyer=${req.query.idBuyer}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    gettransactionbuy : (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE idSeller=${req.query.idSeller}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getalltransactions : (req, res)=>{
        let sql = `SELECT * FROM transactions`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getunverifiedtransaction : (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE idBuyer=${req.query.idBuyer} AND isVerified = 0`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getverifiedtransaction : (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE idBuyer=${req.query.idBuyer} AND isVerified=1`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    gettransactionorder : (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE idSeller=${req.query.idSeller} AND isVerified=1`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    paymentconfirm: (req,res) => {
        let data = JSON.parse(req.body.data)
        let sql = `UPDATE transactions SET tglPembayaran='${data.tglPembayaran}', buktiPembayaran='${req.file.filename}', 
        noRek='${data.noRek}', NamaRek='${data.namaRek}', statusNow='Menunggu Verifikasi' WHERE id=${data.idBuyTransaction}`
        
        let sql2 = `UPDATE alltransactions SET tglPembayaran='${data.tglPembayaran}', buktiPembayaran='${req.file.filename}', 
        noRek='${data.noRek}', NamaRek='${data.namaRek}', statusNow='Menunggu Verifikasi' WHERE id=${data.idBuyTransaction}`
        
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        res.send('Success')
                    })   
                } catch (error) {
                    fs.unlinkSync(req.file.path)
                    console.log(error);
                }
            })   
        } catch (error) {
            fs.unlinkSync(req.file.path)
            console.log(error);
        }
    },

    shippingconfirm: (req,res) => {
        let data = JSON.parse(req.body.data)
        let sql = `UPDATE transactions SET tglPengiriman='${data.tglPengiriman}', buktiPengiriman='${req.file.filename}', 
        noResi='${data.noResi}', hakSeller='${data.hakSeller}', noRekSeller='${data.noRekSeller}', namaRekSeller='${data.namaRekSeller}'  
        WHERE id=${data.idSellTransaction}`

        let sql2 = `UPDATE alltransactions SET tglPengiriman='${data.tglPengiriman}', buktiPengiriman='${req.file.filename}', 
        noResi='${data.noResi}', hakSeller='${data.hakSeller}', noRekSeller='${data.noRekSeller}', namaRekSeller='${data.namaRekSeller}'  
        WHERE id=${data.idSellTransaction}`
        try {
            // if(req.validation) throw req.validation
            // if(req.file.size>5) throw {error: true, message: 'Image size too large'}
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    // if(req.validation) throw req.validation
                    // if(req.file.size>5) throw {error: true, message: 'Image size too large'}
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        res.send(result)
                    })   
                } catch (error) {
                    fs.unlinkSync(req.file.path)
                    console.log(error);
                }
            })   
        } catch (error) {
            fs.unlinkSync(req.file.path)
            console.log(error);
        }
    },
 
    getunpaidverification: (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE buktiPembayaran IS NOT NULL`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getshippingverification: (req, res)=>{
        let sql = `SELECT * FROM transactions WHERE buktiPengiriman IS NOT NULL`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    paymentverification: (req,res) => {
        let sql = `UPDATE transactions SET isVerified=1, statusNow='Menunggu Pengiriman' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET isVerified=1, statusNow='Menunggu Pengiriman' WHERE id=${req.body.id}`
        let sql3 = `UPDATE orders SET isVerified=1 WHERE idTransaction=${req.body.id}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        try {
                            db.query(sql3, (err, result) => {
                                if (err) throw err
                                res.send('success')
                            })   
                        } catch (error) {
                            console.log(error);
                        }
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    shippingverification: (req,res) => {
        let sql = `UPDATE transactions SET hakBuyer=${req.body.hakBuyer}, isShipped=1, statusNow='Sudah dikirim' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET hakBuyer=${req.body.hakBuyer}, isShipped=1, statusNow='Sudah dikirim' WHERE id=${req.body.id}`
        let sql3 = `UPDATE orders SET isShipped=1 WHERE idTransaction=${req.body.id}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        try {
                            db.query(sql3, (err, result) => {
                                if (err) throw err
                                res.send('success')
                            })   
                        } catch (error) {
                            console.log(error);
                        }
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    transactiondone: (req,res) => {
        let sql = `UPDATE transactions SET statusNow='Transaksi selesai' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET statusNow='Transaksi selesai' WHERE id=${req.body.id}`
        let sql3 = `UPDATE orders SET isDone=1 WHERE idTransaction=${req.body.id}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        try {
                            db.query(sql3, (err, result) => {
                                if (err) throw err
                                res.send('success')
                            })   
                        } catch (error) {
                            console.log(error);
                        }
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    deletetransaction: (req, res)=>{
        try {
            db.query(`DELETE FROM transactions WHERE id=${req.body.id} AND statusNow='Transaksi selesai'` , (err, result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }
    },

    deletetransactionmunyuk: (req, res)=>{
        try {
            db.query(`DELETE FROM transactions WHERE id=${req.body.id} AND statusNow='Transaksi selesai'` , (err, result)=>{
                if(err) throw err
                res.send(result)
            })    
        } catch (error) {
            console.log(error);
        }
    },

    rejectverification: (req,res) => {
        let sql = `UPDATE transactions SET isVerified=2, statusNow='Pembayaran Tidak Terverifikasi', ket='Hangus' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET isVerified=2, statusNow='Pembayaran Tidak Terverifikasi', ket='Hangus' WHERE id=${req.body.id}`
        let sql3 = `INSERT INTO history VALUES (0, '${req.body.id}', '${req.body.tglDitolak}', '${req.body.idBuyer}', '${req.body.namaBuyer}',
                    '${req.body.idSeller}', '${req.body.namaSeller}', ${req.body.nilaiTransaksi}, 0, 0, 'Barang tidak dikirim')`
        let sql4 = `DELETE FROM transactions WHERE id=${req.body.id} AND ket='Hangus'`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        try {
                            db.query(sql3, (err, result) => {
                                if (err) throw err
                                try {
                                    db.query(sql4, (err, result) => {
                                        if (err) throw err
                                        res.send('success')
                                    })   
                                } catch (error) {
                                    console.log(error);
                                }
                            })   
                        } catch (error) {
                            console.log(error);
                        }
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    rejectshippingverification: (req,res) => {
        let sql = `UPDATE transactions SET isShipped=2, statusNow='Barang tidak dikirim', ket='Hangus' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET isShipped=2, statusNow='Barang tidak dikirim', ket='Hangus' WHERE id=${req.body.id}`
        let sql3 = `INSERT INTO history VALUES (0, '${req.body.id}', '${req.body.tglDitolak}', '${req.body.idBuyer}', '${req.body.namaBuyer}',
                    '${req.body.idSeller}', '${req.body.namaSeller}', ${req.body.nilaiTransaksi}, 0, 0, 'Barang tidak dikirim')`
        let sql4 = `DELETE FROM transactions WHERE id=${req.body.id} AND ket='Hangus'`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        try {
                            db.query(sql3, (err, result) => {
                                if (err) throw err
                                try {
                                    db.query(sql4, (err, result) => {
                                        if (err) throw err
                                        res.send('success')
                                    })   
                                } catch (error) {
                                    console.log(error);
                                }
                            })   
                        } catch (error) {
                            console.log(error);
                        }
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    receivepacket: (req,res) => {
        let sql = `UPDATE transactions SET tglPenerimaan='${req.body.tglPenerimaan}', statusNow='Sudah diterima' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET tglPenerimaan='${req.body.tglPenerimaan}', statusNow='Sudah diterima' WHERE id=${req.body.id}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                try {
                    db.query(sql2, (err, result) => {
                        if (err) throw err
                        res.send('success')
                    })   
                } catch (error) {
                    console.log(error);
                }
            })   
        } catch (error) {
            console.log(error);
        }
    },

    feedbackpositif: (req,res) => {
        let sql = `UPDATE dataseller SET totalPuas=totalPuas+1, totalFeedback=totalFeedback+1, 
        totalTransaksi=totalTransaksi+1 WHERE idSeller=${req.body.idSeller}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                res.send('success')    
            })   
        } catch (error) {
            console.log(error);
        }
    },

    feedbacknegatif: (req,res) => {
        let sql = `UPDATE dataseller SET totalPuas=totalPuas, totalFeedback=totalFeedback+1, 
        totalTransaksi=totalTransaksi+1 WHERE idSeller=${req.body.idSeller}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                res.send('success')    
            })   
        } catch (error) {
            console.log(error);
        }
    },

    getorderlist : (req, res)=>{
        let sql = `SELECT * FROM orders WHERE idSeller=${req.query.idSeller} AND isVerified=1`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    getorderbuy : (req, res)=>{
        let sql = `SELECT * FROM orders WHERE idBuyer=${req.query.idBuyer} AND isVerified=1`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    }, 

    gethistory: (req, res)=>{
        let sql = `SELECT * FROM history WHERE idBuyer=${req.query.userId} OR idSeller=${req.query.userId}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    }, 

    getdataseller: (req, res)=>{
        let sql = `SELECT * FROM dataseller WHERE idSeller=${req.query.idSeller}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    }, 

    getproductsold: (req, res)=>{
        let sql = `SELECT COUNT(orderQty) AS qtyTerjual FROM orders WHERE idSeller=${req.query.idSeller} AND isDone=1`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    gettotalproduct: (req, res)=>{
        let sql = `SELECT COUNT(id) AS totalProduct FROM products WHERE idUser=${req.query.idSeller}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    }, 

    gettransactiondetail: (req, res)=>{
        let sql = `SELECT * FROM orders WHERE idBuyer=${req.query.idBuyer} AND idTransaction=${req.query.idTransaction}`
        try {
            db.query(sql, (err,result)=>{
                if (err) throw err
                res.send(result)
            })
        } catch (error) {
            console.log(error);
        }
    },

    updatefoto: (req,res) => {
        let data = JSON.parse(req.body.data)
        let sql = `UPDATE users SET fotoProfil='${req.file.filename}' WHERE id=${data}`
        try {
            db.query(sql, (err, result) => {
                if (err) throw err
                res.send('Success')
            })   
        } catch (error) {
            fs.unlinkSync(req.file.path)
            console.log(error);
        }
    },

    updateprofile: (req,res)=>{
        let sql = `UPDATE users SET username='${req.body.username}', email='${req.body.email}', password='${req.body.password}', namaDepan='${req.body.namaDepan}',
        namaBelakang='${req.body.namaBelakang}', noTelp='${req.body.noTelp}', alamat='${req.body.alamat}', kelurahan='${req.body.kelurahan}', 
        kecamatan='${req.body.kecamatan}', kabupaten='${req.body.kabupaten}', propinsi='${req.body.propinsi}', pulau='${req.body.pulau}',
        kodepos='${req.body.kodepos}' WHERE id=${req.body.userId}`
        try {
            db.query(sql, (err,result)=>{
                if(err) throw err
                res.send('Success')
                })
        } catch (error) {
            console.log(error);
        }
    },

    setlogtime: (req,res)=>{
        let sql = `UPDATE dataseller SET waktuLogout='${req.body.waktuLogout}' WHERE idSeller=${req.body.userId}`
        try {
            db.query(sql, (err,result)=>{
                if(err) throw err
                res.send('Success')
                })
        } catch (error) {
            console.log(error);
        }
    },

    transactiontimeout: (req,res)=>{
        let sql = `UPDATE transactions SET ket='Hangus' WHERE id=${req.body.id}`
        let sql2 = `UPDATE alltransactions SET ket='Hangus' WHERE id=${req.body.id}`
        try {
            db.query(sql, (err,result)=>{
                if(err) throw err
                try {
                    db.query(sql2, (err,result)=>{
                        if(err) throw err
                        res.send('Success')
                        })
                } catch (error) {
                    console.log(error);
                }
                })
        } catch (error) {
            console.log(error);
        }
    }
}