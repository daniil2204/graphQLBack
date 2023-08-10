const graphql = require('graphql');
const Item = require('../models/Item.js')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAdmin = require('../utils/checkAdmin')


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
                token: { type: new GraphQLNonNull(GraphQLString) },
            },      
            async resolve(parent,args) {
                if(await checkAdmin(args.token)) {
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
        deleteItem: {
            type:ItemType,
            args: { 
                id: { type: new GraphQLNonNull(GraphQLID) } 
            },
            async resolve(parent,args) {
                const user = await User.find
                const item = await Item.findByIdAndRemove(args.id)
                if(item) return item;
                else return new GraphQLError("Item not found");
            }
        },
        addReviewToItem: {
            type:ItemType,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                id: { type: new GraphQLNonNull(GraphQLID) },
                userID: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent,args) {

                const user = await User.findById(args.userID);
                if(user){
                    const item = await Item.findById(args.id);
                    if(item) {
                        const review = {
                            username: user.username,
                            text: args.text,
                            userID: args.userID
                        }
        
                        item.reviews.push(review);
        
                        return item.save();
                    } else {
                        return new GraphQLError("Item not found");
                    }
                    
                } else{
                    return new GraphQLError("User not found");
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

                    return {
                        id: user.id,
                        ...user._doc,
                    }
                }else{
                    return new GraphQLError("Wrong password or login")
                }
            }
        }
    }
})