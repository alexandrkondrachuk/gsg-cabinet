import * as _ from 'lodash';
import * as axios from 'axios';
import { config } from '../config';

const api = config.get('api');
const urls = config.get('urls');
const userDataURLs = _.get(urls, 'api.userDataURL');
const contentPostsApiURL = _.get(urls, 'api.contentPostsApiURL');
const stationsApiURL = _.get(urls, 'api.stationsApiURL');
const createPurchaseURL = _.get(urls, 'api.createPurchaseURL');
const changePasswordURL = _.get(urls, 'api.changePasswordURL');
const updateUserURL = _.get(urls, 'api.updateUserURL');
const uploadUserFileUrl = _.get(urls, 'api.uploadUserFileUrl');
const categories = _.get(api, 'categories');

export default class Transport {
    // Get stations info from two servers
    static async getStations() {
        try {
            // Get Stations from the WP REST API
            const wpData = await axios.get(contentPostsApiURL, {
                params: {
                    categories: categories.join(','),
                },
            });
            // Get Stations from the API
            const apiData = await axios.get(stationsApiURL);
            // Get Merged Data
            let mergedData = null;
            if (_.get(wpData, 'status') === Transport.STATUS_OK && _.get(apiData, 'status') === Transport.STATUS_OK) {
                const parsedWpData = _.get(wpData, 'data', null);
                const parsedApiData = _.get(apiData, 'data', null);
                if (!parsedWpData || !parsedApiData) return null;

                mergedData = parsedWpData.map((p) => {
                    const apiP = parsedApiData.find((el) => _.get(el, Transport.DATA_ATTR_KEY) === +(_.get(p, Transport.DATA_ATTR_FOREIGN_KEY)));
                    return _.merge(p, apiP);
                });
            }
            return mergedData;
        } catch (err) {
            throw new Error(err);
        }
    }

    // Get user data
    static async getUserData(model = null) {
        const token = _.get(model, 'access_token', null);
        if (!model || !token) return;
        try {
            const userData = await axios.get(userDataURLs, { headers: { Authorization: `Bearer ${token}` } });
            const status = _.get(userData, 'status');
            const data = _.get(userData, 'data');
            if (status === Transport.STATUS_OK) {
                // eslint-disable-next-line consistent-return
                return data;
            }
            // eslint-disable-next-line consistent-return
            return null;
        } catch (e) {
            throw new Error(e);
        }
    }

    // Update user data
    static async updateUserData(model, token) {
        if (!model || !token) return;
        try {
            const update = await axios.post(updateUserURL, model, { headers: { Authorization: `Bearer ${token}` } });
            const status = _.get(update, 'status');
            // eslint-disable-next-line consistent-return
            return (status === Transport.STATUS_OK);
        } catch (e) {
            // eslint-disable-next-line consistent-return
            return e;
        }
    }

    // Upload user verification file
    static async uploadUserFile(model, token) {
        if (!model || !token) return;
        try {
            const upload = await axios.post(uploadUserFileUrl, model, { headers: { Authorization: `Bearer ${token}` } });
            const status = _.get(upload, 'status');
            // eslint-disable-next-line consistent-return
            return (status === Transport.STATUS_OK);
        } catch (e) {
            // eslint-disable-next-line consistent-return
            return e;
        }
    }

    // Do Purchase
    static async doPurchase(model, token) {
        if (!model || !token) return;

        try {
            const purchase = await axios.post(createPurchaseURL, model, { headers: { Authorization: `Bearer ${token}` } });
            const status = _.get(purchase, 'status');

            // eslint-disable-next-line consistent-return
            return status === Transport.STATUS_OK;
        } catch (e) {
            throw new Error(e);
        }
    }

    // Change password
    static async changePassword(model, token) {
        if (!model || !token) return;
        try {
            const change = await axios.post(changePasswordURL, model, { headers: { Authorization: `Bearer ${token}` } });
            const status = _.get(change, 'status');
            // eslint-disable-next-line consistent-return
            return (status === Transport.STATUS_OK);
        } catch (e) {
            // eslint-disable-next-line consistent-return
            return e;
        }
    }
}

Transport.STATUS_OK = 200;
Transport.DATA_ATTR_FOREIGN_KEY = 'acf.power-plant-foreign-id';
Transport.DATA_ATTR_KEY = 'Id';
Transport.AUTH_METHOD = 'POST';
Transport.AUTH_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
};
Transport.TOKEN_HEADER = {
    Authorization: 'Bearer ',
};
