import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import { useIntl } from 'react-intl';
import { t } from '../../../../lang';
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
    formatFormData,
} from './utils';

import './Card.scss';

export default function Card() {
    const intl = useIntl();
    const form = React.createRef();
    const [data, setData] = useState({
        amount: '',
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        issuer: '',
        focused: '',
        formData: null,
    });
    const setState = (name, value) => {
        setData({ ...data, [name]: value });
    };
    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setState('issuer ', issuer);
        }
    };

    const handleInputFocus = ({ target }) => {
        setState('focused', target.name);
    };

    const handleInputChange = ({ target }) => {
        if (target.name === 'number') {
            // eslint-disable-next-line no-param-reassign
            target.value = formatCreditCardNumber(target.value);
        } else if (target.name === 'expiry') {
            // eslint-disable-next-line no-param-reassign
            target.value = formatExpirationDate(target.value);
        } else if (target.name === 'cvc') {
            // eslint-disable-next-line no-param-reassign
            target.value = formatCVC(target.value);
        }

        setState(target.name, target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // const { issuer } = data;
        const formData = [...e.target.elements]
            .filter((d) => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});
        setState('formData', formData);
        form.current.reset();
    };
    const {
        name, number, expiry, cvc, focused, issuer, formData,
    } = data;
    return (
        <div className="Card">
            <Cards
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focused}
                callback={handleCallback}
            />
            <form ref={form} onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder={intl.formatMessage({ id: 'Amount' })}
                        // pattern="[\d| ]{16,22}"
                        required
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="number"
                        className="form-control"
                        placeholder={intl.formatMessage({ id: 'Card Number' })}
                        pattern="[\d| ]{16,22}"
                        required
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                    <small>E.g.: 49..., 51..., 36..., 37...</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={intl.formatMessage({ id: 'Name' })}
                        required
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                </div>
                <div className="row">
                    <div className="col-6">
                        <input
                            type="tel"
                            name="expiry"
                            className="form-control"
                            placeholder={intl.formatMessage({ id: 'Valid Thru' })}
                            pattern="\d\d/\d\d"
                            required
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="tel"
                            name="cvc"
                            className="form-control"
                            placeholder={intl.formatMessage({ id: 'CVC' })}
                            pattern="\d{3,4}"
                            required
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                    </div>
                </div>
                <input type="hidden" name="issuer" value={issuer} />
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block">{t('Pay')}</button>
                </div>
            </form>
            {formData && (
                <div className="App-highlight">
                    {formatFormData(formData).map((d, i) => (
                        <div key={i.toString()}>{d}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
