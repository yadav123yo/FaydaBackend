const Product = require('./product.model');

const express = require('express');

const app = express.Router();

const authMiddleware = require('../Middleware/authMiddleware');

app.get('/', async (req, res) => {

    try {
        let { category,price,numReviews, sort,orderBy ,limit,page } = req.query;
     const query = {};
        if (category) {
            query.category = category;
        }
       
        if (price) {
            let [min, max] = price.split(',');
            query.price = { $gte: min, $lte: max };
            
        }
        if (numReviews) {
            query.stars = +numReviews;
        }
        if(!limit){
            limit = 20;
        }
        if(!page){
            page = 1;
        }
        


        const products = await Product.find(query).sort({ [sort]: orderBy === 'asc' ? 1 :  orderBy === 'desc' ? -1 : 0 }).limit(+limit).skip((+page-1)*limit);
    
    return res.status(200).send({ products });
    } catch (error) {
    return res.status(404).send({ error: error.message });
    }
});

app.get('/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send({ product });
    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
});

app.post('/',authMiddleware, async (req, res) => {

    

    try {
    const { imageUrl, brand, name, stars, numReviews, price, category, type } = req.body;
    const product = await Product.create({ imageUrl, brand, name, stars, numReviews, price, category, type });

    return res.status(201).send({ product });
    } catch (error) {
    return res.status(404).send({ error: 'Something went wrong' });
    }
});

app.put('/:id',authMiddleware, async (req, res) => {
   
    try {
    const { id } = req.params;
    const { imageUrl, brand, name, stars, numReviews, price, category, type } = req.body;
    const product = await Product.findByIdAndUpdate(id, { imageUrl, brand, name, stars, numReviews, price, category, type }, { new: true });

    return res.status(200).send({ product });
    } catch (error) {
    return res.status(404).send({ error: 'Something went wrong' });
    }
});

app.delete('/:id',authMiddleware, async (req, res) => {
    
    
    try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    return res.status(200).send({ product });
    } catch (error) {
    return res.status(404).send({ error: 'Something went wrong' });
    }
});









module.exports = app;