const graphql = require('graphql');
const Item = require('../models/Item.js')
const User = require('../models/User.js')
const Category = require('../models/Category')

const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList,GraphQLString, GraphQLInt,GraphQLError } = graphql;

const UserType = require('../types/userTypes');
const ItemType = require('../types/itemTypes');
const CategoryType = require('../types/categoryTypes');

const checkAuth = require('../utils/checkAuth')

module.exports = new GraphQLObjectType({
    name:'Query',
    fields: {
        getItemById: {
            type: ItemType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent,args) {
                const item = await Item.findById(args.id);
                if(item){
                    return item; 
                }else return new GraphQLError("Item not found");
            }
        },
        getItems: {
            type: new GraphQLList(ItemType),
            args: {
                offset: {type: GraphQLInt},
                limit: {type: GraphQLInt},    
            },
            async resolve(parent,args) {
                return await Item.find({}).skip(args.offset ? args.offset : 0).limit(args.limit ? args.limit : 10);
            }
        },
        getCategoriesByCategoryTitle: {
            type: new GraphQLList(CategoryType),
            args: { category : {type:new GraphQLNonNull(GraphQLString)}},
            async resolve(parent,args) {
                const categories = (await Category.find({})).filter(item => item.category.toLowerCase().includes(args.category.toLowerCase()));
                return categories;
            }
        },
        getItemsByCategory: {
            type: new GraphQLList(ItemType),
            args: { 
                category: {type:new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,args) {
                const items = (await Item.find({})).filter(item => { 
                    for(let i = 0;i < item.category.length; i++) {
                        if(item.category[i].includes(args.category.toLowerCase())){
                            return true;
                        }
                    }
                    return false;
                });
                return items;
            }
        },
        getMe: {
            type: UserType,
            args: { },
            async resolve(parent,args, contextValue){
                const user = await checkAuth((contextValue.headers.authorization).split(" ")[1]);
                return user ? user : new GraphQLError("User not found");
            }
        },
    }
})