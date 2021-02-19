import Express, { Request, Response, NextFunction } from 'express';
import Cors from 'cors';
import Helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import Connect from '../database/Connect';
import GraphQL from '../graphql/GraphQL';
import Collection from '../utilities/Collection';
import Logger from '../utilities/Logger';
import { forums } from '../../Util';

import ForumModel from '../database/models/Forum';

export default class Server {

    #server: any;

    constructor() {
        this.#server = Express();
        this.#server.tokens = new Collection();
        
        this.#server.enable("trust proxy");
        this.#server.use(Helmet());
        this.#server.use(Cors({
            origin: true,
            credentials: true
        }));

        if(process.env.PRODUCTION) {
            this.#server.use(RateLimit({
                windowMS: 1000 * 60 * 60,
                max: 1000
            }))
        }

        this.load();
    }

    public async load() {
        new Connect();
        new GraphQL(this.#server);

        for(let forum of forums) {
            let _forum = await ForumModel.findOne({ name: `${forum.name}` });
            if(_forum) return;

            let _newForumModel = await (new ForumModel({
                name: forum.name,
                type: forum.type,
                threads: []
            }).save());
            if(_newForumModel) throw Error(`[ERROR] Can't be to create new forum.`);
        }
    }

    public listen() {
        this.#server.listen(process.env.PORT, () => {
            Logger.prototype.log(`Express`, `Express Server ready at http://localhost${process.env.PORT}`);
        });
    }
}