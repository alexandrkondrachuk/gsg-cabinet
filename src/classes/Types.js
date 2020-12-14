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
            id: 3, name: 'Purchase', tagName: 'purchase', icon: 'faDollarSign',
        },
        {
            id: 4, name: 'History', tagName: 'history', icon: 'faHistory',
        },
        {
            id: 5, name: 'Deposit', tagName: 'deposit', icon: 'faBusinessTime',
        },
    ];

    static tabsMap = Types.tabs.reduce((acc, item) => acc.set(item.id, { ...item }), new Map());
}
