var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Vaishuisgoodgirl';
const User = require('../models/User')

const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: " Access Denied!.Login or Sign Up then try!" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        const exitinguser = await User.findById(data.id);
        if (!exitinguser) {
            return res.status(401).send({ error: " Access Denied!.Login or Sign Up then try!" })
        }

        req.user = data.id;

        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}
module.exports = fetchuser;


