const jwt = require('jsonwebtoken');
const {Token} = require('../../models/authModels/token-model');


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})//поменять значения
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})//поменять значения
        return {
            accessToken,
            refreshToken
        }
    }
    // проверка токена
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where:{tokenuser: userId}})
            if (tokenData) {
          tokenData.tokenuser=userId
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({tokenuser:userId,  refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({where:{refreshToken:refreshToken}})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({where:{refreshToken:refreshToken}})
        return tokenData;
    }
}

module.exports = new TokenService();
