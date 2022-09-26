import ProductModel from '../Models/ProductModel';
import jwt from "jsonwebtoken";


const addProduct = async (req, res) => {
    const { name, price } = req.body;
    const barToken = req.headers.authorization;
    try {
        const token = barToken.split(' ')[1];
        const tokenDecoded = jwt.verify(token, `${process.env.KEY_JWT}`);
        const email = tokenDecoded.email
        const productFind = await ProductModel.findOne({ name });
        if (productFind) return res.status(203).json({
            status: 'Failed',
            message: `Product with name (${name}) already exists`,
        });
        const newProduct = new ProductModel({
            name: name,
            price: price,
            owner: email
        });
        await newProduct.save();
        return res.status(200).json({
            status: 'successfully',
            message: 'Product added',
            data: {
                newProduct,
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
        })
    }

};
const getAll = async (req, res) => {
    try {
        const allProduct = await ProductModel.find();
        let products = null;
        allProduct.length == 0 ? products = "No products available" : products = allProduct
        res.status(200).json({
            status: 'successfully',
            message: 'All products',
            data: {
                products
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
        })
    }
};

const updateProduct = async (req, res) => {
    const { idProduct } = req.params;
    const { name, price } = req.body;
    if (!name || !price) return res.status(404).json({
        status: 'failed',
        message: 'No product name or price',
    });
    try {
        const newProduct = await ProductModel.findOneAndUpdate({
            _id: idProduct
        }, {
            $set: {
                name: name,
                price: price,
            }
        });
        res.status(200).json({
            status: 'successfully',
            message: `product cod: (${idProduct}) updated`

        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
        })
    }
}

const deleteProduct = async (req, res) => {
    const { idProduct } = req.params;
    try {
        const deleteProduct = await ProductModel.findOneAndDelete({
            _id: idProduct
        });
        if (!deleteProduct) return res.status(401).json({
            status: 'failed',
            message: 'Product not exists',
        });
        return res.status(200).json({
            status:'successfully',
            message: `product cod: (${idProduct}) deleted`
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Failed server',
            error: error
        })
    }
};
module.exports = {
    addProduct,
    getAll,
    updateProduct,
    deleteProduct
};