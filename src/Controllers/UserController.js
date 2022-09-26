import UserModel from "../Models/UsersModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { TIME_SESSION_JWT } = process.env
const addUser = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;
    if (!name || !email || !password || !password_confirmation) return res.status(403).json({
        status: 'Failed',
        message: 'All fields are required',
    });
    try {
        //Validations
        if (password !== password_confirmation) return res.status(403).json({
            status: 'Failed',
            message: 'Password are not same as confirmation',
        });
        const user = await UserModel.findOne({ email });
        if (user) return res.status(403).json({
            status: 'Failed',
            message: 'Email is already in use',
        });
        //Encryption
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        //insert
        const newUser = new UserModel({
            name: name,
            email: email,
            password: hash,
        });
        await newUser.save();
        return res.status(200).json({
            status: 'successfully',
            message: 'User added',
            data: {
                newUser,
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
        })
    }
};

const logUser = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) return res.status(203).json({
        status: 'Failed',
        message: 'All fields are required',
    });
    try {
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(203).json({
            status: 'Failed',
            message: 'The user not exist',
        });
        const compare = await bcrypt.compare(password, user.password);
        if (compare) {
            const dataUser = {
                name: user.name,
                email: user.email,
            }
            const token = jwt.sign(dataUser, process.env.KEY_JWT, { expiresIn: `${process.env.TIME_SESSION_JWT}` })
            return res.status(500).json({
                status: 'successfully',
                message: `Welcome to Atronauta ${user.name} `,
                data: {
                    token,
                }
            });
        }
        return res.status(203).json({
            status: 'Failed',
            message: 'Password is incorrect',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
        })
    }
}

// const whoAmi = async (req, res) => {
//     const { authorization } = req.headers
//     if (authorization) return res.status(403).json({
//         status: 'Failed',
//         message: 'Unauthorized',
//     });
//     try {
//         const token = authorization.split(' ')[1];
//         const dataUser = await jwt.verify(token, process.env.KEY_JWT);
//         const user = await UserModel.findByEmail(dataUser.email);

//     } catch (error) {
//         return res.status(500).json({
//             status: 'Failed',
//             message: 'Failed server',
//         })
//     }
// }

module.exports = {
    addUser,
    logUser
};