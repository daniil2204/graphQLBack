const yup = require('yup');
const { inputRule } = require('graphql-shield');

const addItemValidation = inputRule()(
    (yup) => 
    yup.object({
        title: yup.string().min(3,"Too short"),
        price: yup.number(),
        imageUrl: yup.string(),
        category: yup.array(),
    }),
    { abortEarly: false },
)

const registerValidation = inputRule()(
    (yup) => 
    yup.object({
        username: yup.string().min(3,"Too short"),
        email: yup.string().email(),
        password: yup.string().min(3,"Too short"),
        phone: yup.string().matches(/^039|067|068|096|097|098|050|066|095|099|063|073|093|091|048\d{9}$/,{message:'Невірний телефон'}),
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

const addNewCategoryValidation = inputRule()(
    (yup) => 
    yup.object({
        category: yup.string().min(3,"Too short"),
    }),
    { abortEarly: false },
)

const addNewItemToCategoryValidation = inputRule()(
    (yup) => 
    yup.object({
        category: yup.string().min(3,"Too short"),
        categories: yup.array(),
    }),
    { abortEarly: false },
)




module.exports = { addItemValidation , registerValidation, loginValidation,addReviewToItemValidation, addNewCategoryValidation, addNewItemToCategoryValidation }