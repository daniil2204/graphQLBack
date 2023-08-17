const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema.js');
const mongoose = require('mongoose');
const { applyMiddleware } = require('graphql-middleware');
const { shield } = require('graphql-shield');
const { addItemValidation, registerValidation, loginValidation, addReviewToItemValidation,addNewCategoryValidation,addNewItemToCategoryValidation } = require('../rules');


const app = express();
const PORT = 5000  || process.env.PORT ;

mongoose.connect(process.env.MONGODB)


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
