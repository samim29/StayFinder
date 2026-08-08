const jwt = require('jsonwebtoken');

/**
 * @description generate token utility function
 * 
 */
const generateToken = (res, user) => {
    const token = jwt.sign(
        {id: user._id,role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '30d'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict',
        maxAge:30 * 24 * 60 * 60 * 1000, // 30 days, keep in sync with JWT_EXPIRES_IN  
    })
    return token;
}

module.exports = generateToken;