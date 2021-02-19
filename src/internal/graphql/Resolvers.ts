import { gql, makeExecutableSchema } from 'apollo-server-express';

import UserModel from '../database/models/User';
import ThreadModel, { Thread } from '../database/models/Thread'; 

export const _emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export default class Resolvers {

    #server: Express.Application | any;

    public typeDefs: any;
    public resolvers: any;

    constructor(server: Express.Application) {
        this.#server = server;
        
        this.setTypeDefs();
        this.setResolvers();
    }

    public setTypeDefs() {
        this.typeDefs = gql`
            type User {
                data: String
                message: String
                exited_code: Int
            }
            type GenericResponse {
                message: String
                exited_code: Int
            }
            type SignUpData {
                token: String
                user: String
                message: String
                exited_code: Int
            }
            type SignInData {
                token: String
                message: String
                exited_code: Int
            }
            type Query {
                getUser(token: String, id: String): User
                getProfile(usernameOrID: String): User
            }
            type Mutation {
                createUser(username: String, email: String, password: String, confirm_password: String, pin: String): SignUpData
                signIn(usernameOrEmail: String, password: String): SignInData
                createThread(token: String, title: String, description: String, tags: [String], forum: String): GenericResponse
            }
        `;
    }

    public setResolvers() {
        this.resolvers = {
            Query: {
                getUser: async (parent, args, context, info) => {
                    let _response = {
                        data: "e30=",
                        message: null,
                        exited_code: 1
                    }

                    if(!args.token) {
                        _response.message = `don't token proved`;

                        return _response;
                    }
                    
                    let _user: any = await UserModel.findOne({ token: `${args.token}` });
                    if(!_user) {
                        _response.message = `unknown user`;

                        return _response;
                    }

                    _user.password = null;

                    _response.data = Buffer.from(`${JSON.stringify(_user)}`).toString('base64') || null;
                    _response.message = `ok`;
                    _response.exited_code = 0;

                    return _response;
                },
                getProfile: async (parent, args, context, info) => {
                    let _response = {
                        data: "e30=",
                        message: null,
                        exited_code: 1
                    }

                    if(!(args.usernameOrID)) {
                        _response.message = `dont username or id provided`;
                        
                        return _response;
                    }
                    
                    let _user: any = await (UserModel.findOne({ username: `${args.usernameOrID}` }) || UserModel.findOne({ id: (parseInt(args.usernameOrID) || null) }));
                    if(!_user) {
                        _response.message = `unknown user`;

                        return _response;
                    }

                    _user.email = null;
                    _user.password = null;
                    _user.pin = null;

                    _response.data = Buffer.from(`${JSON.stringify({
                        id: _user.id || null,
                        username: _user.username || null,
                        created_at: _user.created_at || 0,
                        verified: _user.verified || false,
                        profile: _user.profile || null,
                        posts: _user.posts || null
                    })}`).toString('base64')

                    return _response;
                }
            },
            Mutation: {
                createUser: async (parent, args, context, info) => {
                    let _response = {
                        token: null,
                        user: null,
                        message: null,
                        exited_code: 1
                    }

                    if(!(args.username || args.email || args.password || args.confirm_password || args.pin)) {
                        _response.message = `need more information`;

                        return _response;
                    }

                    if(!/^[A-Za-z0-9_-]*$/g.test(`${args.username}`)) {
                        _response.message = `username only can contain capital letters, lower case, numbers and underscores.`;

                        return _response;
                    }

                    if(!await _emailRegex.test(args.email)) {
                        _response.message = `invalid email`;
                        
                        return _response;
                    }

                    if(args.password.length < 6 || args.password.length > 500) {
                        _response.message = `The password must have a minimum number of characters of 6, and a maximum number of characters of 500`;

                        return _response;
                    }

                    if(args.password !== args.confirm_password) {
                        _response.message = `the password does not match the confirmed password`;

                        return _response;
                    }

                    if(typeof parseInt(args.pin) !== "number" || (`${args.pin}`.length < 1 || args.pin > 9999)) {
                        _response.message = `invalid pin, this need to contain 4 numbers`;

                        return _response;
                    }

                    let _alreadyExistUser = await UserModel.findOne({ username: `${args.username}` }) || await UserModel.findOne({ email: `${args.email}` });
                    if(_alreadyExistUser) {
                        _response.message = `user already exist with the email or username`;

                        return _response;
                    }

                    _response.token = ((length: number) => {
                        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890#$&/=".split("");
                        var b = [];  
                        for (var i=0; i < length; i++) {
                            var j = (Math.random() * (a.length-1)).toFixed(0);
                            b[i] = a[j];
                        }
                        return b.join("");
                    })(25);

                    let _userDocument = null;

                    try {
                        _userDocument = await (new UserModel({
                            token: `${_response.token}`,
                            id: Math.floor(Math.random() * 10000000000000000),
                            username: args.username,
                            email: args.email,
                            password: args.password,
                            pin: parseInt(args.pin),
                            created_at: Date.now()
                        }).save());
                    } catch(err) {
                        _response.message = `${err.slice(0, 1000)}`;

                        return _response;
                    }

                    _response.user = Buffer.from(`${JSON.stringify(_userDocument)}`).toString('base64');
                    _response.message = `ok`;
                    _response.exited_code = 0;

                    return _response;
                },
                signIn: async (parent, args: { usernameOrEmail: string, password: string }, context, info) => {
                    let _response = {
                        token: null,
                        message: null,
                        exited_code: 1
                    }

                    if(!(args.usernameOrEmail || args.password)) {
                        _response.message = `need more information`;

                        return _response;
                    }

                    let _user: any = await UserModel.findOne({ username: `${args.usernameOrEmail}` }) || await UserModel.findOne({ email: `${args.usernameOrEmail}` });
                    if(!_user || (_user && !(_user.token || _user.id || _user.username || _user.email || _user.password))) {
                        _response.message = `the user with this username or email doesn't exist`

                        return _response;
                    }

                    if(_user.password !== `${args.password}`) {
                        _response.message = `incorrect password`

                        return _response;
                    }

                    _response.token = _user.token || null;
                    _response.exited_code = 0;

                    return _response;
                },
                createThread: async (parent, args: { token: string, title: string, description: string, tags: string[], forum: string }, context, info) => {
                    let _response = {
                        message: null,
                        exited_code: 1
                    }

                    if(!(args.token || args.title || args.description || args.tags || args.forum)) {
                        _response.message = `not all data has been sent`;

                        return _response;
                    }

                    let _user = await UserModel.findOne({ token: `${args.token}` });
                    if(!_user) {
                        _response.message = `unknown user with this token`;

                        return _response;
                    }

                    if(!args.title.length || (args.title.length && (args.title.length >= 250 || args.title.length <= 1))) {
                        _response.message = `the title length is invalid (1-250)`;

                        return _response;
                    }

                    if(!args.description.length || (args.description.length && (args.description.length >= 2500 || args.description.length <= 1))) {
                        _response.message = `the title description is invalid (1-2500)`;

                        return _response;
                    }

                    if(!Array.isArray(args.tags)) {
                        _response.message = `tags is array`;

                        return _response;
                    }

                    if(args.tags.length && args.tags.length > 50) {
                        _response.message = `only can be accept like maximum 50 tags`;

                        return _response;
                    }

                    let _someArrayIsInvalid = false;
                    for(let tag of args.tags) {
                        if(!/^[a-zA-Z]+$/g.test(`${tag}`)) {
                            _someArrayIsInvalid = true;

                            break;
                        }
                    }

                    if(_someArrayIsInvalid) {
                        _response.message = `some array is not string, the arrays only can be text`;

                        return _response;
                    }

                    let _thread: Thread = {
                        id: Math.random() * 999999999999999999,
                        author: {
                            id: _user.id
                        },
                        title: `${args.title}`,
                        description: `${args.description}`,
                        tags: args.tags.slice(0, 50),
                        comments: [],
                        created_at: Date.now(),
                        forum: args.forum.slice(0, 100) || null
                    }

                    try {
                        await (new ThreadModel(_thread).save());
                    } catch(err) {
                        _response.message = `${err.slice(0, 1000)}`;

                        return _response;
                    }
                    
                    _response.message = "ok";
                    _response.exited_code = 0;

                    return _response;
                }
            }
        }
    }

    public get getSchema() {
        return makeExecutableSchema({
            typeDefs: this.typeDefs,
            resolvers: this.resolvers
        });
    }
}