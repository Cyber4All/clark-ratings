import * as sendgrid from '@sendgrid/mail'
import { NewRatingData } from '../types/NewRatingData';

// Note for future tests
// Enums are not supported in ts-jest: https://github.com/kulshekhar/ts-jest/pull/308/files
export enum EMAIL_TYPE {
    NEW_RATING = 'd-03ad7a19fc29497e9015bc2473ff6451'
}

export class SendgridDriver {
    private static instance: SendgridDriver;

    private map = new Map<string, string>();

    private constructor() {
        // Finish sendgrid setup
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

        // Create a map for the email subject based off of email type
        this.map.set(EMAIL_TYPE.NEW_RATING, 'CLARK - New Rating');
    }

    /**
     * Gets a SendgridDriver instance, following the singleton pattern
     */
    public static getInstance(): SendgridDriver {
        if (!this.instance) {
            this.instance = new SendgridDriver();
        }
        return this.instance;
    }

    /**
     * Sends a new rating email to the author of the learning object
     * 
     * @param to The author email to send to
     * @param data The dynamic template data to send
     */
    public async sendEmail(to: string, type: EMAIL_TYPE, data: any): Promise<void> {
        if (this.validateData(type, data)) {
            const msg = {
                to,
                from: 'no-reply@clark.center',
                subject: this.map.get(type),
                templateId: type,
                dynamic_template_data: data
            };
            await sendgrid.send(msg);
        }
    }

    /**
     * Validates the data object given the email type
     * 
     * @param type The email type
     * @param data The data to validate
     */
    private validateData(type: EMAIL_TYPE, data: any): data is NewRatingData {
        switch (type) {
            case EMAIL_TYPE.NEW_RATING:
                if (this.validateNewRatingData(data)) {
                    return data
                }
                break;
        }
        return undefined;
    }

    /**
     * Returns true if the data object conforms to the NewRatingData interface
     * 
     * @param data The data to validate
     */
    private validateNewRatingData(data: any): boolean {
        const { object, user, ...extra } = data;
        if (!object || !object.name || !object.cuid || !object.avgRating || !user || !user.firstName || !user.username) {
            return false;
        }
        return true;
    }
}