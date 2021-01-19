import { Map } from 'immutable';
// import * as _ from 'lodash';

export default class Types {
    static tabs = [
        {
            id: 1, name: 'Profile', tagName: 'profile', icon: 'faIdCard',
        },
        {
            id: 2, name: 'Investments', tagName: 'investments', icon: 'faMoneyCheck',
        },
        {
            id: 3, name: 'Purchases', tagName: 'purchase', icon: 'faDollarSign',
        },
        {
            id: 4, name: 'History', tagName: 'history', icon: 'faHistory',
        },
        {
            id: 5, name: 'Deposit', tagName: 'deposit', icon: 'faBusinessTime',
        },
    ];

    static tabsMap = Types.tabs.reduce((acc, item) => acc.set(item.id, { ...item }), new Map());

    static purchaseErrors = {
        InternalServerError: 'Internal server error',
        'Insufficient funds': 'Insufficient funds',
    };

    static operationType = {
        1: 'Deposit',
        2: 'Withdrawal',
        3: 'Purchase',
        4: 'Dividend',
    };

    static withdrawalMethods = [
        {
            id: 0, name: 'Bitcoin', icon: 'bitcoinIcon', enabled: true,
        },
        {
            id: 1, name: 'Card', icon: 'creditCardIcon', enabled: true,
        },
    ];

    static withdrawalMethodsMap = Types.withdrawalMethods.reduce((acc, item) => acc.set(item.id, { ...item }), new Map());
}
