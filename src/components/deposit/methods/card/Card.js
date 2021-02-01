import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import Cards from 'react-credit-cards';
import { useIntl } from 'react-intl';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { t } from '../../../../lang';
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
} from './utils';
import { config } from '../../../../config';
import CardPaymentModel from '../../../../models/card-payment-model';
import Transport from '../../../../classes/Transport';

import './Card.scss';

const limits = config.get('limits');

export default function Card({ token }) {
    const intl = useIntl();
    const form = React.createRef();
    const [modal, setModal] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const initialStore = {
        amount: '',
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        smsCode: '',
        issuer: '',
        focused: '',
        formData: null,
        model: null,
    };
    const [data, setData] = useState(initialStore);
    const [isDisabledField, disableField] = useState(false);
    const toggle = () => setModal(!modal);
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
        } else if (target.name === 'amount') {
            if (+target.value > limits.max) {
                // eslint-disable-next-line no-param-reassign
                target.value = limits.max;
            } else if (+target.value < limits.min) {
                // eslint-disable-next-line no-param-reassign
                target.value = limits.min;
            }
        }

        setState(target.name, target.value);
    };

    // eslint-disable-next-line no-return-await
    const doPaymentRequest = async (m, tk) => (await Transport.doCardPayment(m, tk));

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = [...e.target.elements]
            .filter((d) => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});
        setState('formData', formData);
        const {
            amount: Sum, number: CardNumber, name: CardHolderName, expiry: ExpiredDate, cvc: Cvv,
        } = formData;
        const model = new CardPaymentModel({
            CardHolderName,
            CardNumber,
            Cvv,
            ExpiredDate,
            Sum,
        });
        setState('model', model);
        form.current.reset();
        disableField(true);
        doPaymentRequest(model, token)
            .then((res) => {
                if (res) {
                    toggle();
                }
            })
            .catch(() => {
                throw new Error('Error in payment method');
            });
    };

    const handleSubmitSMSVerification = (e) => {
        e.preventDefault();
        const { model, smsCode } = data;
        const updatedModel = new CardPaymentModel({ ...model, SmsCode: smsCode, Status: 2 });

        doPaymentRequest(updatedModel, token)
            .then((res) => {
                if (res) {
                    setShowInfo(true);
                    setData(initialStore);
                    disableField(false);
                    _.delay(() => {
                        setShowInfo(false);
                        toggle();
                    }, 3500);
                }
            })
            .catch((err) => {
                throw err;
            });
    };
    const toggleModal = () => {
        setData(initialStore);
        setShowInfo(false);
        disableField(false);
        toggle();
    };
    const {
        name, number, expiry, cvc, focused, issuer,
    } = data;
    const isActive = name && number && expiry && cvc;
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
                    <label htmlFor="amount">
                        { t('Amount') }
                        , $
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        className="form-control"
                        placeholder={intl.formatMessage({ id: 'Amount' })}
                        // pattern="[\d| ]{16,22}"
                        required
                        readOnly={isDisabledField}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
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
                        readOnly={isDisabledField}
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
                        readOnly={isDisabledField}
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
                            readOnly={isDisabledField}
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
                            readOnly={isDisabledField}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                    </div>
                </div>
                <input type="hidden" name="issuer" value={issuer} />
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block" disabled={isDisabledField || !isActive} onFocus={handleInputFocus}>{t('Pay')}</button>
                </div>
            </form>
            <Modal isOpen={modal} toggle={toggle} backdrop="static" className="SMSCodeModal">
                <ModalHeader toggle={toggleModal}>
                    {t('SMS confirmation code')}
                </ModalHeader>
                <ModalBody>
                    <form id="sms-verification-code-form" onSubmit={handleSubmitSMSVerification}>
                        <div className="form-group">
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="SmsCode">{t('SMS Code')}</label>
                            <input
                                type="text"
                                id="smsCode"
                                name="smsCode"
                                className="form-control"
                                placeholder={intl.formatMessage({ id: 'SMS Code' })}
                                required
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                        </div>
                    </form>
                    {showInfo && <p className="alert alert-success">{t('Your payment is being processed. Wait for funds to be credited.')}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button
                        disabled={showInfo}
                        color="primary"
                        onClick={(e) => {
                            handleSubmitSMSVerification(e);
                        }}
                    >
                        {t('Send SMS Code')}
                    </Button>
                    {' '}
                    <Button
                        color="secondary"
                        onClick={toggleModal}
                    >
                        {t('Cancel')}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

Card.propTypes = {
    token: PropTypes.string.isRequired,
};
