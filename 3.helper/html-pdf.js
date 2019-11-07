const fs = require('fs')
const handlebars = require('handlebars')
const pdf = require('html-pdf')
const pdfTemplate = require('./historyTemplate')



module.exports = {
    pdfcreate: (html, replacements, options, cb) =>{
        fs.readFile(html, {encoding: 'utf-8'},(err, readtHTML)=>{
            if(err){
                console.log(err);
                return false
            } else {
                var template = handlebars.compile(readtHTML)
                var HTMLtoPDF = template(replacements)
                
                pdf.create(HTMLtoPDF, options).toStream((err,stream)=>{
                    if(err){
                        console.log(err);
                        return cb(stream)
                    } else {
                        return cb(stream)
                    }
                })
            }
        })
    }
}