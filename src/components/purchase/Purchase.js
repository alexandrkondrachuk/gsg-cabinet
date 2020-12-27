import React from 'react';
import { t } from '../../lang';
import './Purchase.scss';

export default function Purchase() {
    return (
        <div className="Purchase">
            <h2 className="Purchase__Title">{t('My purchases')}</h2>
        </div>
    );
}
