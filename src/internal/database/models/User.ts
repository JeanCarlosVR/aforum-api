import Mongoose from 'mongoose';

export interface InteractionUser {
    id: number
    date: number
}

export interface UserSchema {
    token: string
    id: number
    username: string
    email: string
    password: string
    pin: number
    created_at: number
    verified: boolean
    permissions: any[]
    profile: {
        display_name: string
        avatar: string
        description: string
        badges: number[]
        contact_mail: string
        contact_phone_number: {
            country_identificator: number
            number: number
        }
        social_networks: {
            twitter: string
            instagram: string
            youtube: string
            discord: string
            github: string
        }
        reputation: InteractionUser[]
        likes: InteractionUser[]
    }
    preferences: {
        receive_direct_messages: boolean
        blocked_users: number[]
    }
    posts: any[]
    security: {
        verification: {
            verified_email: boolean
            verified_number_phone: boolean
        }
    }
}

export const _userSchema: Mongoose.Schema = new Mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    created_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    permissions: {
        type: Array,
        required: true,
        default: [
            "post",
            "delete_post",
            "edit_post"
        ]
    },
    profile: {
        type: Object,
        required: true,
        default: {
            display_name: null,
            avatar: null,
            description: null,
            badges: [],
            contact_mail: null,
            contact_phone_number: {
                country_identificator: null,
                number: null
            },
            social_networks: {
                twitter: null,
                instagram: null,
                youtube: null,
                discord: null,
                github: null
            },
            reputation: [],
            likes: []
        }
    },
    preferences: {
        type: Object,
        required: true,
        default: {
            receive_direct_messages: true,
            blocked_users: []
        }
    },
    posts: {
        type: Array,
        required: true,
        default: []
    },
    security: {
        type: Object,
        required: true,
        default: {
            verification: {
                verified_email: false,
                verified_number_phone: false
            }
        }
    }
});

const _userModel: Mongoose.Model<Mongoose.Document<UserSchema>> = Mongoose.model("user", _userSchema);
export default _userModel;