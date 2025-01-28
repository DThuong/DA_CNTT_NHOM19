const jsonwebtoken = require("jsonwebtoken");

const generateAccessToken = (uid, role) => {
    return jsonwebtoken.sign({_id: uid, role}, process.env.JWT_SECRET, { expiresIn: "2d" });
}

const generateRefreshToken = (uid, role) => {
    return jsonwebtoken.sign({_id: uid, role}, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}