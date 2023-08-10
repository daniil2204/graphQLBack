const graphql = require('graphql');
const Item = require('../models/Item.js')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAdmin = require('../utils/checkAdmin')
const checkAuth = require('../utils/checkAuth')


const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLError, GraphQLNonNull,GraphQLID } = graphql;

const UserType = require('../types/userTypes');
const ItemType = require('../types/itemTypes');




module.exports = new GraphQLObjectType({
    name:"Mutation",
    fields: {
        addItem: {
            type:ItemType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
            },      
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const item = new Item({
                        title: args.title,
                        price: args.price,
                        imageUrl: args.imageUrl
                    })
                    return item.save();
                } else {
                    return new GraphQLError("Error");
                }

                
            }
        },
        updateItem: {
            type: GraphQLString,
            args: { 
                id: { type: new GraphQLNonNull(GraphQLID) } ,
                title: { type: GraphQLString },
                price: { type: GraphQLInt },
                imageUrl: { type: GraphQLString },
            },
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const item = await Item.updateOne({
                        _id:args.id
                    }, {
                        ...args
                    },);
                    if(item) return "Item was modified";
                    else return new GraphQLError("Item not found");
                } else {
                    return new GraphQLError("Error");
                }
            }
        },
        deleteItem: {
            type:ItemType,
            args: { 
                id: { type: new GraphQLNonNull(GraphQLID) } 
            },
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const item = await Item.findByIdAndRemove(args.id)
                    if(item) return item;
                    else return new GraphQLError("Item not found");
                } else {
                    return new GraphQLError("Error");
                }
            }
        },
        addReviewToItem: {
            type:GraphQLString,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent,args,contextValue) {
                const user = await checkAuth((contextValue.headers.authorization).split(" ")[1]);
                if(user){
                    const review = {
                        username: user.username,
                        text: args.text,
                    }
                    const item = await Item.findById(args.id);
                    const newItem = await Item.updateOne({
                        _id:args.id
                    }, {
                        reviews: [...item.reviews,review]
                    },);
                    if(newItem) return "Review was added";
                    else return new GraphQLError("Review was not added");
                    
                } else{
                    return new GraphQLError("User not auth");
                }              
            }
        },
        register: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent,args) {
                const email = args.email;
                const oldUser = await User.findOne({email})
                if(oldUser) return new GraphQLError("A user is already registered")

                const encryptedPass = await bcrypt.hash(args.password,10);

                const newUser = new User({
                    username:args.username,
                    email:args.email.toLowerCase(),
                    password:encryptedPass,
                })

                const token = jwt.sign(
                    { user_id: newUser._id,email, }, 
                    "tokenPassword",
                    {
                        expiresIn: "30d"
                    }
                )

                newUser.token = token;

                const res = await newUser.save();
                return{
                    id: res.id,
                    ...res._doc
                }
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent,args){
                const email = args.email;
                const user = await User.findOne({email});

                if(user && (await bcrypt.compare(args.password, user.password))) {
                    const token = jwt.sign(
                        { user_id: user._id,email, }, 
                        "tokenPassword",
                        {
                            expiresIn: "30d"
                        }
                    )

                    user.token = token;

                    return user;
                }else{
                    return new GraphQLError("Wrong email or password")
                }
            }
        }
    }
})