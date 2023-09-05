class CustomnAPIError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomnError = (msg,statusCode)=>{
    return new CustomnAPIError(msg,statusCode)
}

module.exports = {createCustomnError,CustomnAPIError}