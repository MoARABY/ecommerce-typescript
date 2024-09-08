import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




const verifyToken = (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(403).json({'message': 'Invalid token'});
            Jwt.verify(token, process.env.JWT_SECRET ?? '',(err, user) => {
            if (err) return res.status(401).json({'message': 'Invalid token or expired'});
            console.log(user)
            req.user = user;
            console.log(req.user)
            next()
        });
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({'message': 'Unauthorized'});
        next();
    });
}

export {verifyToken, verifyAdmin};