import Mongoose from 'mongoose';

export interface Comment {
    id: number
    author: {
        id: number
    }
    content: string
    created_at: number
}

export interface Thread {
    id: number
    author: {
        id: number
    }
    title: string
    description: string
    tags: string[]
    comments: Comment[]
    created_at: number
    forum: string
}

export const _threadSchema: Mongoose.Schema = new Mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    author: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true,
        default: []
    },
    comments: {
        type: Array,
        required: true,
        default: []
    },
    created_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    forum: {
        type: String,
        required: true
    }
});

const _threadModel: Mongoose.Model<Mongoose.Document<Thread>> = Mongoose.model("thread", _threadSchema);
export default _threadModel;