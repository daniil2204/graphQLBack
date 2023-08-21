const graphql = require('graphql')

const Item = require('../models/Item')
const User = require('../models/User')
const Category = require('../models/Category')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { 
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const checkAdmin = require('../utils/checkAdmin')
const checkAuth = require('../utils/checkAuth')


const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLError, GraphQLNonNull,GraphQLID, GraphQLList } = graphql;

const UserType = require('../types/userTypes');
const ItemType = require('../types/itemTypes');
const CategoryType = require('../types/categoryTypes');



module.exports = new GraphQLObjectType({
    name:"Mutation",
    fields: {
        addItem: {
            type:ItemType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
            },      
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const item = new Item({
                        title: args.title,
                        price: args.price,
                        imageUrl: args.imageUrl,
                        category: args.category
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
        addItemToBucket: {
            type:GraphQLString,
            args: {
                count: { type: new GraphQLNonNull(GraphQLInt) },
                itemId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent,args,contextValue) {
                const user = await checkAuth((contextValue.headers.authorization).split(" ")[1]);
                const item = await Item.findById(args.itemId);
                if(user && item){
                    if(args.count < 1){
                       
                        const userWithUpdatedBucket = await User.updateOne({
                            _id:user._id
                        }, {
                            bucket: user.bucket.filter(bucketItem => bucketItem.itemId.valueOf() !== item._id.valueOf())
                        },);
                        
                        if(userWithUpdatedBucket) return "Item was deleted from Bucket";
                    }else{
                        const bucketItem = {
                            userId: user._id,
                            price: item.price * args.count,
                            count: args.count,
                            itemId: item._id,
                            imageUrl: item.imageUrl,
                            title: item.title
                        }
                        
                        const ItemWasAdded = user.bucket.find(itemArr => itemArr.itemId.valueOf() === item._id.valueOf());
    
                        const changedBucket = ItemWasAdded ? {bucket: [...user.bucket.filter(bucketItem => bucketItem.itemId.valueOf() !== item._id.valueOf()),bucketItem]} : {bucket: [...user.bucket,bucketItem]}
    
                        const userWithUpdatedBucket = await User.updateOne({
                            _id:user._id
                        }, {
                            bucket: changedBucket.bucket
                        },);
                        
                        
                        if(userWithUpdatedBucket) return "Item was added to Bucket";
                        else return new GraphQLError("Item was not added to Bucket");
                    }
                    
                } else{
                    return new GraphQLError("User or Item not found");
                }              
            }
        },
        clearBucket: {
            type:GraphQLString,
            args: {},
            async resolve(parent,args,contextValue) {
                const user = await checkAuth((contextValue.headers.authorization).split(" ")[1]);
                if(user){          
                    const userWithUpdatedBucket = await User.updateOne({
                        _id: user._id
                    }, {
                        bucket: []
                    },);
                      
                    if(userWithUpdatedBucket) return "Bucket clear";
                    else return new GraphQLError("Error");
                    
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
                phone: { type: new GraphQLNonNull(GraphQLString) },
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
                    phone:args.phone,
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
        },
        addNewCategory: {
            type:CategoryType,
            args: {
                category: { type: new GraphQLNonNull(GraphQLString) },
                categories: { type: new GraphQLList(GraphQLString) },
            },
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const category = new Category({
                        category: args.category,
                        categories: args.categories,
                    })
                    return category.save();
                } else {
                    return new GraphQLError("Error");
                }           
            }
        },
        addNewItemToCategory: {
            type:GraphQLString,
            args: {
                category: { type: new GraphQLNonNull(GraphQLString) },
                categories: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
            },
            async resolve(parent,args,contextValue) {
                if(await checkAdmin((contextValue.headers.authorization).split(" ")[1])) {
                    const prevCategory = await Category.findOne({category: args.category});
                    const newItem = await Category.updateOne({
                        _id:prevCategory._id
                    }, {
                        categories: [...prevCategory.categories,...args.categories]
                    },);
                    if(newItem) return "New category was added";
                    else return new GraphQLError("New category was not added");
                } else {
                    return new GraphQLError("Error");
                }           
            }
        }
    }
})