module.exports = function(req,res,next){
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,DELETE,POST")
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Authorisation,Content-Type" )

    if(req.method === 'OPTIONS')
        return res.sendStatus(200)

    return next();
}