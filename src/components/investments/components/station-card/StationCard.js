import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';
import {
    Row, Col,
    Card, CardBody,
    CardTitle, Button,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkedAlt, faFileSignature, faPercentage, faBatteryQuarter, faTags, faHandHoldingUsd, faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import NumericInput from 'react-numeric-input';
import Slider from 'react-rangeslider';
import numeral from 'numeral';
import { t } from '../../../../lang';
import { config } from '../../../../config';
import Transport from '../../../../classes/Transport';
import AuthInfoModel from '../../../../models/auth-info-model';

import './StationCard.scss';

const dateFormat = config.get('dateFormat');
const limits = config.get('limits');
const numberShortFormat = config.get('numberShortFormat');

export default function StationCard({ station, authInfo }) {
    const [modal, setModal] = useState(false);
    const [formModel, setFormModel] = useState({
        KilowattAmount: 0,
        Amount: 0,
        PaymentAmount: 0,
    });
    const [investStatus] = useState(true);
    const toggle = () => setModal(!modal);
    // const toggleInvestStatus = () => setInvestStatus(!investStatus);
    const setPowerAmount = (value) => {
        const pricePerKW = _.get(station, 'PricePerKW');
        const paymentPerKW = _.get(station, 'PaymentPerKW');
        const kilowattAmount = +(value / pricePerKW).toFixed(2);
        const paymentAmount = +(kilowattAmount * paymentPerKW).toFixed(2);
        setFormModel({
            ...formModel, Amount: value, KilowattAmount: kilowattAmount, PaymentAmount: paymentAmount,
        });
    };

    const handleChangeAmount = (value) => {
        // eslint-disable-next-line no-nested-ternary
        const amount = (value > limits.max) ? limits.max : (value < limits.min) ? limits.min : value;
        setPowerAmount(amount);
    };

    const handleChangeSliderAmount = (value) => {
        // eslint-disable-next-line no-nested-ternary
        setPowerAmount(value);
    };

    const doInvest = async () => {
        const token = _.get(authInfo, 'access_token', null);
        const model = {
            UserId: '',
            PowerPlantId: _.get(station, 'Id', ''),
            KilowattAmount: _.get(formModel, 'KilowattAmount', 0),
        };
        const purchase = await Transport.doPurchase(model, token);
        if (purchase) toggle();
    };

    return (
        <div className="StationCard">
            <Card>
                <Row className="StationCard__Row">
                    <Col sm="12" md="7">
                        <div className="StationCard__Col">
                            <img className="StationCard__Thumbnail" src={_.get(station, 'fimg_url')} alt={_.get(station, 'StationName', 'Station Name')} />
                        </div>
                    </Col>
                    <Col sm="12" md="5">
                        <div className="StationCard__Col StationCard__Col__Details">
                            <div className="CardBody">
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faFileSignature} />
                                        { ' ' }
                                        { t('Station name') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ _.get(station, 'StationName', 'Station Name') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faMapMarkedAlt} />
                                        { ' ' }
                                        { t('Address') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ _.get(station, 'Address', 'Address') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faPercentage} />
                                        { ' ' }
                                        { t('ROI') }
                                        , % :
                                    </span>
                                    <span className="card-value">{ _.get(station, 'Roi', '0') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faBatteryQuarter} />
                                        { ' ' }
                                        { t('Minimum power, kWh') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ numeral(_.get(station, 'MinPower', '0')).format(numberShortFormat).replace(',', ' ') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faTags} />
                                        { ' ' }
                                        { t('Price $ per kWh') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ numeral(_.get(station, 'PricePerKW', '0')).format(numberShortFormat).replace(',', ' ') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faHandHoldingUsd} />
                                        { ' ' }
                                        { t('Payouts $ per kWt monthly') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ numeral(_.get(station, 'PaymentPerKW', '0')).format(numberShortFormat).replace(',', ' ') }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        { ' ' }
                                        { t('Start of construction') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ moment(_.get(station, 'StartBuildingDate', '')).format(dateFormat) }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        { ' ' }
                                        { t('End of construction') }
                                        :
                                    </span>
                                    <span className="card-value">{ moment(_.get(station, 'EndBuildingDate', '')).format(dateFormat) }</span>
                                </CardTitle>
                                <CardTitle tag="p">
                                    <span className="card-subtitle">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        { ' ' }
                                        { t('End of investment') }
                                        {' '}
                                        :
                                    </span>
                                    <span className="card-value">{ moment(_.get(station, 'EndInvestmentDate', '')).format(dateFormat) }</span>
                                </CardTitle>
                            </div>
                        </div>
                    </Col>
                </Row>
                <CardBody>
                    <Button className="btn btn-success" onClick={toggle}>{t('Invest')}</Button>
                </CardBody>
            </Card>
            <Modal modalClassName="InvestmentModal" isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    { _.get(station, 'StationName', 'Station Name') }
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col sm="12" lg="6">
                                <FormGroup>
                                    <Label for="InvestmentAmount">{t('Investment Amount, $')}</Label>
                                    {/* eslint-disable-next-line max-len */}
                                    <NumericInput id="InvestmentAmount" name="InvestmentAmount" className="form-control" {...limits} value={formModel.Amount} onChange={handleChangeAmount} />
                                </FormGroup>
                            </Col>
                            <Col sm="12" lg="6">
                                <FormGroup>
                                    <Label for="InvestmentAmountSecondary" className="d-none">Amount</Label>
                                    {/* eslint-disable-next-line max-len */}
                                    <Slider id="InvestmentAmountSecondary" name="InvestmentAmountSecondary" {...limits} value={formModel.Amount} onChange={handleChangeSliderAmount} />
                                </FormGroup>
                            </Col>
                            <Col sm="12" lg="6">
                                <FormGroup>
                                    <Label for="PowerAmount">{t('Power Amount, kwt')}</Label>
                                    <Input className="form-control" id="PowerAmount" name="PowerAmount" type="text" value={formModel.KilowattAmount} readOnly />
                                </FormGroup>
                            </Col>
                            <Col sm="12" lg="6">
                                <FormGroup>
                                    <Label for="PaymentAmount">{t('Payment Amount, $ (monthly)')}</Label>
                                    <Input className="form-control" id="PaymentAmount" name="PaymentAmount" type="text" value={formModel.PaymentAmount} readOnly />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={doInvest} disabled={!investStatus}>{t('Invest')}</Button>
                    {' '}
                    <Button color="secondary" onClick={toggle}>{t('Cancel')}</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

StationCard.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    station: PropTypes.object.isRequired,
    authInfo: PropTypes.instanceOf(AuthInfoModel).isRequired,
};
