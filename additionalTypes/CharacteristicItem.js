const graphql = require('graphql');
const { GraphQLString,GraphQLInputObjectType } = graphql;

module.exports = new GraphQLInputObjectType({
    name:'CharacteristicInput',
    fields: () => ({
        title: { type: GraphQLString },
        text: { type: GraphQLString },
    })
})
