const {validationResult} = require("express-validator");
const UserModel = require("../models/User");
const {hashedPassword, comparePassword, createToken} = require("../services/authServices");


//@route POST /api/register
//@access Public
//@desc Create user and return a token
module.exports.register = async (req,res) => {
    const errors = validationResult(req);
    if(errors.isEmpty())
    {
        const {name, email, password} = req.body;
        try{
            const emailExist = await UserModel.findOne({email});
            if(!emailExist)
            {
                const hashed = await hashedPassword(password);
                const user = await UserModel.create({
                    name: name,
                    email: email,
                    password: hashed
                });
                
                const token = createToken({id: user._id, name: user.name});

                return res.status(201).json({msg: "Your account has been added",token:token}); 
            }
            else
            {
                return res.status(400).json({errors: [{msg:"Email already taken",param:'email'}]});
            }
        }
        catch(error){
            console.log("these are the errrors: " + error.message);
            return res.status(500).json("Server internal error!");
        }
    }
    else
    {
        //Validation failed
        return res.status(400).json({errors: errors.array()}) 
    }
}

//@route POST /api/login
//@access Public
//@desc Login user and return a token
module.exports.login = async(req,res) => {
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty())
    {
        try {
            const user = await UserModel.findOne({email});
            if(user)
            {
                if(await comparePassword(password, user.password))
                {
                    const token = createToken({id: user._id,name:user.name});
                    if(user.admin)
                    {
                        return res.status(201).json({token,admin: true});
                    }
                    else
                    {
                        return res.status(201).json({token,admin: false})
                    }
                }
                else
                {
                    return res.status(400).json({errors: [{msg: "Invalid Password!",param:'password'}]});
                }

            }
            else
            {
                return res.status(400).json({errors: [{msg: email+ " is not found",param:'email'}]});
            }
        } 
        catch (error) {
            console.log(error.message);
            return res.status(500).json("Server Internal Error!");
        }
    }
    else
    {
        // validation failed
        return res.status(400).json({errors: errors.array()});
    }
}
