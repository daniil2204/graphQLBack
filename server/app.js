const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema.js');
const mongoose = require('mongoose');
const { applyMiddleware } = require('graphql-middleware');
const { shield } = require('graphql-shield');


const app = express();
const PORT = 5000;

mongoose.connect('mongodb+srv://daniilfrilanc:Ddv22042004@cluster0.uewffss.mongodb.net/?retryWrites=true&w=majority')

const yup = require('yup');
const { inputRule } = require('graphql-shield');

const registerValidation = inputRule()(
    (yup) => 
    yup.object({
        title: yup.string().min(5,'Too short')
    }),
    { abortEarly: false },
)

const permissions = shield({
    Query: {},
    Mutation: {
        addItem: registerValidation,
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