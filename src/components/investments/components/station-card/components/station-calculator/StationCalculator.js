import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
    Button, Col, Form, FormGroup, Input, Label, Row,
    Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import * as _ from 'lodash';
import Slider, { SliderTooltip } from 'rc-slider';
import numeral from 'numeral';
import { useIntl } from 'react-intl';
import { config } from '../../../../../../config';
import { t } from '../../../../../../lang';
import StationCalculatorModel from '../../../../../../models/station-calculator-model';
import Types from '../../../../../../classes/Types';
import UserInfoModel from '../../../../../../models/user-info-model';

const depositTab = Types.tabsMap.get(5);
const limits = config.get('limits');
const numberShortFormat = config.get('numberShortFormat');
const numberFormat = config.get('numberFormat');
const { purchaseErrors } = Types;

export default function StationCalculator({
    model, userInfo, setModelValue, station, toggle: togglePage, doInvest,
}) {
    const intl = useIntl();
    const initInfo = { type: 'error', message: '', show: false };
    const [modal, setModal] = useState(false);
    const [info, setInfo] = useState(initInfo);
    const toggle = () => setModal(!modal);
    const balance = _.get(userInfo, 'Balance', 0);

    const { Handle } = Slider;

    const handle = (props) => {
        const {
            // eslint-disable-next-line react/prop-types
            value, dragging, index, ...restProps
        } = props;
        return (
            <SliderTooltip
                prefixCls="rc-slider-tooltip"
                overlay={`${numeral(value).format(numberShortFormat).replace(',', ' ')} $`}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </SliderTooltip>
        );
    };

    const handleChangeSliderAmount = (value) => {
        let v = +(value);
        v = v > limits.max ? limits.max : v;
        v = v < limits.min ? limits.min : v;
        // eslint-disable-next-line no-nested-ternary
        const pricePerKW = _.get(station, 'PricePerKW');
        const paymentPerKW = _.get(station, 'PaymentPerKW');
        const KilowattAmount = +(v / pricePerKW).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        const paymentAmount = +(KilowattAmount * paymentPerKW).toFixed(2);
        const PaymentAmount = numeral(paymentAmount).format(numberFormat).replace(',', ' ');
        let InvestmentReturn = Math.ceil(+(v / paymentAmount));
        // eslint-disable-next-line no-restricted-globals
        InvestmentReturn = isNaN(InvestmentReturn) ? 0 : InvestmentReturn;
        setModelValue(new StationCalculatorModel({
            Amount: `${v}`, Roi: _.get(station, 'Roi', 0), PaymentAmount, KilowattAmount, InvestmentReturn,
        }));
    };

    useEffect(() => {
        handleChangeSliderAmount(config.get('defaultInvestAmount'));
    }, []);

    const doDeposit = () => {
        togglePage(depositTab.id.toString());
    };

    const resetResult = (timeout = 3000) => {
        _.delay(() => {
            toggle();
            setInfo({ ...initInfo });
        }, timeout);
    };

    const invest = async () => {
        const result = await doInvest();
        const message = _.get(result, 'Message', null);
        if (message) {
            setInfo({ ...info, message: intl.formatMessage({ id: purchaseErrors[message] }), show: true });
        }
        if (typeof result === 'number') {
            setInfo({
                ...info, message: intl.formatMessage({ id: 'Your investment has been successfully accepted' }), type: 'success', show: true,
            });
        }
        resetResult();
    };

    return (
        <>
            <Form id="calculator-form">
                <Row>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Label for="amount">{ t('Amount, $') }</Label>
                            {/* eslint-disable-next-line max-len */}
                            <Input type="number" name="amount" id="amount" placeholder="" value={model.Amount} onChange={(e) => handleChangeSliderAmount(_.get(e, 'target.value', 0))} />
                        </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                        <FormGroup className="form-group-slider">
                            <Label for="amountSecondary" className="d-none">{ t('Amount, $') }</Label>
                            {/* eslint-disable-next-line max-len */}
                            <Slider id="amountSecondary" name="amountSecondary" {...limits} marks={{ [limits.min]: `${limits.min} $`, [limits.max]: `${numeral(limits.max).format(numberShortFormat).replace(',', ' ')} $` }} value={model.Amount} handle={handle} onChange={handleChangeSliderAmount} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Label for="powerAmount">{ t('Power amount, kwt') }</Label>
                            <Input type="text" name="powerAmount" id="powerAmount" placeholder="-" value={model.KilowattAmount} readOnly />
                        </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Label for="paymentAmount">{ t('Payment Amount, $ (mon.)') }</Label>
                            <Input type="text" name="paymentAmount" id="paymentAmount" placeholder="-" value={model.PaymentAmount} readOnly />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Label for="roi">{ t('ROI, %') }</Label>
                            <Input type="text" name="roi" id="roi" placeholder="-" value={model.Roi} readOnly />
                        </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Label for="investmentReturn">{ t('Investment return, mon.') }</Label>
                            <Input type="text" name="investmentReturn" id="investmentReturn" placeholder="-" value={model.InvestmentReturn} readOnly />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="6">
                        <FormGroup>
                            {/* eslint-disable-next-line max-len */}
                            <Button className="btn btn-success" block onClick={toggle} disabled={(balance <= 0) || (+(_.get(model, 'Amount')) === 0) || (+(_.get(model, 'Amount')) > balance)}>{ t('Buy') }</Button>
                        </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                        <FormGroup>
                            <Button className="btn btn-success" block onClick={doDeposit}>{ t('Deposit') }</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
            <Modal isOpen={modal} toggle={toggle} backdrop="static" modalClassName="StationBuyModal">
                <ModalHeader toggle={toggle}>
                    {t('Invest to {name}', { name: _.get(station, 'StationName', '') })}
                </ModalHeader>
                <ModalBody>
                    {/* eslint-disable-next-line max-len */}
                    {t('Do you confirm your investment in the {name} of the {amount} $ ?', {
                        name: <strong className="station-name">{_.get(station, 'StationName', '')}</strong>,
                        amount: <strong className="investment-amount">{numeral(model.Amount).format(numberShortFormat).replace(',', ' ')}</strong>,
                    })}
                    {info.show && <p className={info.type}>{info.message}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={invest}>{t('Confirm')}</Button>
                    {' '}
                    <Button color="secondary" onClick={toggle}>{t('Cancel')}</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

StationCalculator.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    model: PropTypes.object.isRequired,
    userInfo: PropTypes.instanceOf(UserInfoModel).isRequired,
    setModelValue: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    station: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
    doInvest: PropTypes.func.isRequired,
};
