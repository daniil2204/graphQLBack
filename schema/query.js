const graphql = require('graphql');
const Item = require('../models/Item.js')
const User = require('../models/User.js')

const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList } = graphql;

const UserType = require('../types/userTypes');
const ItemType = require('../types/itemTypes');

module.exports = new GraphQLObjectType({
    name:'Query',
    fields: {
        getItemById: {
            type: ItemType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent,args) {
                const item = Item.findById(args.id);
                if(item){
                    return item; 
                }else return new GraphQLError("Item not found");
            }
        },
        getItems: {
            type: new GraphQLList(ItemType),
            args: {},
            resolve(parent,args) {
                return Item.find({});
            }
        }
    }
})