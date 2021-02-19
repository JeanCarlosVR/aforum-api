import { ApolloServer } from 'apollo-server-express';
import GraphQLSchema from './Resolvers';
import Logger from '../utilities/Logger';

export default class GraphQL {

    #server: ApolloServer;

    constructor(server: Express.Application | any) {
        let _GraphQLSchema = new GraphQLSchema(server);

        this.#server = new ApolloServer({
            schema: _GraphQLSchema.getSchema,
            playground: {
                version: '1.7.25',
                settings: {
                    ["request.credentials"]: "same-origin",
                }
            },
            formatError: (err): Error => {
                if (err.message.startsWith('Database Error: ')) {
                    return new Error('Internal server error');
                }
                return err;
            }
        });

        this.#server.applyMiddleware({ app: server });
        Logger.prototype.log("GraphQL", `GraphQL Server ready at http://localhost${process.env.PORT}${this.#server.graphqlPath}`);
    }
}