const yup = require('yup');
const { inputRule } = require('graphql-shield');

const registerValidation = inputRule()(yup => yup.object({
    addItem: yup.object({
        title: yup.string().min(5)
    })
}))

module.exports = { registerValidation }