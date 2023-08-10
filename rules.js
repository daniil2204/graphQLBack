const yup = require('yup');
const { inputRule } = require('graphql-shield');

const addItemValidation = inputRule()(
    (yup) => 
    yup.object({
        title: yup.string().min(3,"Too short"),
        price: yup.number(),
        imageUrl: yup.string(),
    }),
    { abortEarly: false },
)

const registerValidation = inputRule()(
    (yup) => 
    yup.object({
        username: yup.string().min(3,"Too short"),
        email: yup.string().email(),
        password: yup.string().min(3,"Too short"),
    }),
    { abortEarly: false },
)

const loginValidation = inputRule()(
    (yup) => 
    yup.object({
        email: yup.string().email(),
        password: yup.string().min(3,"Too short"),
    }),
    { abortEarly: false },
)

const addReviewToItemValidation = inputRule()(
    (yup) => 
    yup.object({
        text: yup.string().min(15,"Too short")
    }),
    { abortEarly: false },
)




module.exports = { addItemValidation , registerValidation, loginValidation,addReviewToItemValidation }