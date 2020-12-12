import React from 'react';
import * as PropTypes from 'prop-types';
import Profile from '../profile';
import Investments from '../investments';
import Purchase from '../purchase';
import History from '../history';
import Deposit from '../deposit';

import './TabsRenderer.scss';

export default function TabsRenderer({ tag }) {
    const components = {
        profile: Profile,
        investments: Investments,
        purchase: Purchase,
        history: History,
        deposit: Deposit,
    };
    const TagName = components[tag || 'profile'];
    return <TagName />;
}

TabsRenderer.propTypes = {
    tag: PropTypes.oneOf(['profile', 'investments', 'purchase', 'history', 'deposit']).isRequired,
};
