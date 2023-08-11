const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema.js');
const mongoose = require('mongoose');
const { applyMiddleware } = require('graphql-middleware');
const { shield } = require('graphql-shield');
const { addItemValidation, registerValidation, loginValidation, addReviewToItemValidation,addNewCategoryValidation,addNewItemToCategoryValidation } = require('../rules');


const app = express();
const PORT = 5000;

mongoose.connect('mongodb+srv://daniilfrilanc:Ddv22042004@cluster0.uewffss.mongodb.net/?retryWrites=true&w=majority')


const permissions = shield({
    Query: {},
    Mutation: {
        addItem: addItemValidation,
        register: registerValidation,
        login: loginValidation,
        addReviewToItem: addReviewToItemValidation,
        addNewCategory: addNewCategoryValidation,
        addNewItemToCategory: addNewItemToCategoryValidation,
    },
});

const schemasWithPermissions = applyMiddleware(schema,permissions);



app.use('/graphql', graphqlHTTP({
    schema: schemasWithPermissions,
    graphiql: {
        headerEditorEnabled: true,
    },
}));

const DBconnected = mongoose.connection;

DBconnected.on('err', (err) => console.log('DB error'))
DBconnected.once('open', () => console.log('DB is ok'))

app.listen(PORT,(err) => {
    err ? console.log('Server error') : console.log('Server OK');
});


// { "Authorization": "Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjRkMTJmN2U5ZWE3MzU5ZjcwMjMzNDI2IiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2OTE0MzA3ODIsImV4cCI6MTY5NDAyMjc4Mn0.PNo_mCLVF5Bl5Gftmia-aXn2zSmx04jewwuUZuBCakg"}