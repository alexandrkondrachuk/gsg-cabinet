import { Map } from 'immutable';
// import * as _ from 'lodash';

export default class Types {
    static tabs = [
        { id: 1, name: 'Profile', tagName: 'profile' },
        { id: 2, name: 'Investments', tagName: 'investments' },
        { id: 3, name: 'Purchase', tagName: 'purchase' },
        { id: 4, name: 'History', tagName: 'history' },
        { id: 5, name: 'Deposit', tagName: 'deposit' },
    ];

    static tabsMap = Types.tabs.reduce((acc, item) => acc.set(item.id, { ...item }), new Map());
}
