let jwt = require('jsonwebtoken')
const appKey = 'secretKey'

module.exports = {

    gettoken: (req,res)=>{
        let {username} = req.body
        let token = jwt.sign({username}, appKey, {expiresIn: '12h'}) //Harus disimpen selama 12jam
        res.send({
            username,
            token
        })
    },

    verifytoken: (req,res,next)=>{
        if(req.method !== 'OPTIONS'){
            // let success = true
            // console.log(req.headers.authorization)      //parameter decoded = hasil
            jwt.verify(req.headers.authorization, appKey, (error, decoded)=>{
                if(error){
                    // success = false;
                    return res.status(401).json({ message: "User not authorized", error: "User not authorized"})
                    //.json = seperti res.send
                    // tidak pake else karena sudah ada return, ketika return dijalankan, code dibawahnya tidak dijalankan
                } 
                // console.log({decoded}); //iat = dibuatnya kapan, exp = expirednya kapan
                req.user = decoded; //buat sendiri req.user, biasanya req.body, req.query dll kita bikin sndiri
                next();    
                // next dari javascript, bisa dinamai apa aja doraemon, dll, sebenarnya bentuknya () aja
            });
        } else {
            next();
        }
    }
}
