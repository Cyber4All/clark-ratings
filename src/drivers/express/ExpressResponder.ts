
import { Responder } from '../../interfaces/Responder';
import { Response } from 'express';
import { Rating } from '../../types/Rating';

export class ExpressResponder implements Responder {

    constructor(private res?: Response) {} 

    sendOperationSuccess() {
        this.res.sendStatus(200);
    }

    sendOperationError(error: string, status?: number) {
        error && status
        ? this.res.status(status).send(error)
        : error && !status
          ? this.res.status(400).send(error)
          : !error && status
            ? this.res.status(status).send('Server error encountered.')
            : this.res.status(400).send('Server error encountered.');
    }

    sendRatings(ratings: Rating | Rating[]) {
        // Remove id before sending to client 
        delete ratings._id;
        this.res.status(200).json(ratings);
    }
}