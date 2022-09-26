import jwt from "jsonwebtoken";
import UsersModel from "../Models/UsersModel";
import ProductModel from "../Models/ProductModel";

const verifyToken = async (req, res, next) => {
    const barToken = req.headers['authorization'];
    if (!barToken) return res.status(401).json({
        status: 401,
        message: 'No authorization header provided'
    })
    try {
        const token = barToken.split(' ')[1];
        const tokenDecoded = jwt.verify(token, `${process.env.KEY_JWT}`);
        const email = tokenDecoded.email
        if (tokenDecoded) {
            const user = await UsersModel.findOne({ email });

            if (!user) return res.status(401).json({
                status: "Failed",
                message: 'Invalid autentication'
            });
            req.user = user;
            req.JWTauthenticated = true;
            req.userData = tokenDecoded;
            return next();
        }
        return res.status(401).json({
            status: "Failder",
            message: 'Unauthorized'
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed Server",
            error: error
        });
    }
}

const verifyProduct = async (req, res, next) => {
    const barToken = req.headers['authorization'];
    const { idProduct } = req.params;
    if (!barToken) return res.status(401).json({
        status: 401,
        message: 'No authorization header provided'
    })
    try {
        const token = barToken.split(' ')[1];
        const tokenDecoded = jwt.verify(token, `${process.env.KEY_JWT}`);
        const email = tokenDecoded.email
        if (tokenDecoded) {
            const productUser = await ProductModel.findOne({
                $and: [
                    {
                        owner: email
                    },
                    {
                        _id: idProduct
                    }
                ]
            });
            if (!productUser) return res.status(401).json({
                status: "Failed",
                message: 'Unauthorized product'
            });
            return next();
        }
        return res.status(401).json({
            status: "Failder",
            message: 'Unauthorized'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Failed",
            message: "Failed Server",
            error: error
        });
    }
}
module.exports = {
    verifyToken,
    verifyProduct
}