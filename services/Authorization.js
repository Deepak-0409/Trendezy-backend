const jwt = require("jsonwebtoken")
const {JWT_KEY} = require("../config/envConfig")

class Authorization {
    authorized(req,res,next) {
        const headerToken = req.headers.authorization;
        if(headerToken)
        {
            const token = headerToken.split('Bearer ')[1];
            const verified = jwt.verify(token, JWT_KEY);
            if(verified)
            {
                next();
            }
            else
            {
                return res.status(401).json({errors:[{msg:"Please add a valid token"}]})
            }
        }
        else
        {
            return res.status(401).json({errors:[{msg:"unauthorized access"}]})
        }
    }
}
module.exports = new Authorization();