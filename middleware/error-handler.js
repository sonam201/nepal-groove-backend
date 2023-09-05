 const { CustomnAPIError} = require('../errors/customn -error')

const errorHandlerMiddleware = (err,req,res,next)=>{
    if(err instanceof CustomnAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }
    return res.status(500).json({msg:'Something went wrong , Please try again'})
}
module.exports = errorHandlerMiddleware