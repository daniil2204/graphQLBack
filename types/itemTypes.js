const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;

const ReviewItem = require('../additionalTypes/ReviewItem');

const CharacteristicItem = new GraphQLObjectType({
    name:'Characteristic',
    fields: () => ({
        title: { type: GraphQLString },
        text: { type: GraphQLString },
    })
})

module.exports = new GraphQLObjectType({
    name:'Item',
    fields: () => ({
        id: { type:GraphQLID },
        title: { type:GraphQLString },
        category: { type: new GraphQLList(GraphQLString) },
        price: { type:GraphQLInt },
        imageUrl: { type:GraphQLString },
        reviews: { type: new GraphQLList(ReviewItem) },
        infoAbout: {type: new GraphQLList(CharacteristicItem) },
    })
})

