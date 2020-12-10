import React from 'react';
import { FormattedNumber } from 'react-intl';

const number = (values = {}) => <FormattedNumber {...values} />;

export default number;
