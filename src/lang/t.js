import React from 'react';
import { FormattedMessage } from 'react-intl';

const t = (id = '', value = {}) => {
    if (!id) return null;
    return (<FormattedMessage id={id} values={{ ...value }} />);
};

export default t;
