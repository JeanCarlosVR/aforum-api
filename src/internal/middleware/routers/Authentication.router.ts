import Express, { Request, Response, Router } from 'express';
import { api_auth_version } from '../../../config';

import UserModel from '../../database/models/User';

export default class Authentication {

    #server: any;
    #router: Express.Router;

    constructor(server: Express.Application) {
        this.#server = server;
        this.#router = Router();

        this.setRoutes();
        this.registerRouter();
    }

    public setRoutes() {
        this.#router.get(`/`, async (req: Request, res: Response) => {
            return res.json({
                exited_code: 0,
                status: 200,
                message: `ok`
            });
        });

        this.#router.post(`/create/user`, async (req: Request, res: Response) => {
        });
    }

    public registerRouter() {
        this.#server.use(`/api/auth/v${api_auth_version}`, this.#router);
    }
}