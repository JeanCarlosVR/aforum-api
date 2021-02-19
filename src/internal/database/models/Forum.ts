import Mongoose from 'mongoose';

export enum ForumType {
    "only_admins_write" = 0,
    "only_vips_write" = 1,
    "everyone_write" = 2
}

export interface ForumSchema {
    name: string
    type: 0
}

export const _forumSchema: Mongoose.Schema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: Number,
        required: true,
        default: 2
    }
});

const _forumModel: Mongoose.Model<Mongoose.Document<ForumSchema>> = Mongoose.model("forum", _forumSchema);
export default _forumModel;