const UserModel = require('../models/user.model');
const generateToken = require('../utils/generateToken.util');
const tokenBlackListModel = require('../models/blackList.model');
/**
 * @description register user controller
 * @route POST /api/auth/register
 * @access public
 */
const registerUserController = async (req, res) => {
    try{
        const { name, email, password, phone, role } = req.body;

        const existingUser = await UserModel.findOne({ 
            $or: [
                {email},
                {phone}
            ]
         });
        if(existingUser) {
            return res.status(400).json({ message: "An account with this email or phone number already exists"});
        }

        const user = await UserModel.create({
            name,
            email,
            password,
            phone,
            role : role === 'owner' ? 'owner' : 'student',
        })

        generateToken(res,user);

        res.status(201).json({
            "message" : "user created successfully",
            user: {
            _id: user._id,
            name: user._name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }
        });

    }catch(error){
        console.log(error);
        res.status(500).json({"message" : "internal server error"});
    }
}

/**
 * @description login user controller
 * @route POST /api/auth/login
 * @access public
 */

const loginUserController = async (req, res) => {
    try{
        
        const {identifier, password, role} = req.body;
        const cleanIdentifier = identifier.trim();
        const normalizedRole = role.trim().toLowerCase();

        const user = await UserModel.findOne({
            $or: [
                {email : cleanIdentifier.toLowerCase()},
                {phone: cleanIdentifier}
            ]
        }).select('+password')

        if(!user) {
            return res.status(401).json({message: "Invalid credentials."});
        }
        if(user.role !== normalizedRole) {
            return res.status(403).json({message: "You are not authorized to log in as this role."});
        }
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        generateToken(res,user);
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user._name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    }catch(error){
        console.log(error);
        res.status(500).json({"message" : "internal server error"});
    }  
}
/**
 * @description logout user controller
 * @route POST /api/auth/logout
 * @access public
 */
const logoutUserController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

/**
 * @description get user profile controller
 * @route GET /api/auth/profile
 * @access private
 */
const getUserProfileController = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registerUserController, loginUserController,logoutUserController, getUserProfileController };