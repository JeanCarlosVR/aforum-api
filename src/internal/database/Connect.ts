import Mongoose from 'mongoose';
import Logger from '../utilities/Logger';

export default class Connect {
    constructor() {
        Mongoose.connect(`${process.env.MONGO_ATLAS_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).then(() => {
            Logger.prototype.log(`Mongo Atlas`, `Mongo Atlas connected successfully.`);
        }).catch((err: any) => {
            Logger.prototype.error(`Mongo Altas`, `Mongo Atlas failed while trying to connect: ${err}`);
        });
    }
}