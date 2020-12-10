import React from 'react';
import { FormattedTime } from 'react-intl';

const dateTime = (values = {}) => <FormattedTime {...values} />;

export default dateTime;
