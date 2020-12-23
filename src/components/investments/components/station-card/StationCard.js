import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';
import {
    Row, Col,
    Card, CardBody,
    CardTitle, Button,
    Form, FormGroup, Label, Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkedAlt, faFileSignature, faPercentage, faBatteryQuarter, faTags, faHandHoldingUsd, faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import Slider, { SliderTooltip } from 'rc-slider';
import numeral from 'numeral';
import { t } from '../../../../lang';
import { config } from '../../../../config';
// import Transport from '../../../../classes/Transport';
import AuthInfoModel from '../../../../models/auth-info-model';

import 'rc-slider/assets/index.css';
import './StationCard.scss';

const dateFormat = config.get('dateFormat');
const limits = config.get('limits');
const numberShortFormat = config.get('numberShortFormat');
const numberFormat = config.get('numberFormat');

export default function StationCard({ station }) {
    const [formModel, setFormModel] = useState({
        KilowattAmount: 0,
        Amount: 0,
        PaymentAmount: 0,
        Roi: _.get(station, 'Roi', 0),
        EndInvestmentDate: moment(_.get(station, 'EndInvestmentDate')).format(dateFormat),
    });
    const setPowerAmount = (value) => {
        const pricePerKW = _.get(station, 'PricePerKW');
        const paymentPerKW = _.get(station, 'PaymentPerKW');
        const kilowattAmount = +(value / pricePerKW).toFixed(2);
        const paymentAmount = numeral(+(kilowattAmount * paymentPerKW).toFixed(2)).format(numberFormat).replace(',', ' ');
        setFormModel({
            ...formModel, Amount: value, KilowattAmount: kilowattAmount, PaymentAmount: paymentAmount,
        });
    };

    const handleChangeSliderAmount = (value) => {
        let v = +(value);
        v = v > limits.max ? limits.max : v;
        v = v < limits.min ? limits.min : v;
        // eslint-disable-next-line no-nested-ternary
        setPowerAmount(v);
    };

    // console.log('form model', formModel);

    /*    const doInvest = async () => {
        const token = _.get(authInfo, 'access_token', null);
        const model = {
            UserId: '',
            PowerPlantId: _.get(station, 'Id', ''),
            KilowattAmount: _.get(formModel, 'KilowattAmount', 0),
        };
        const purchase = await Transport.doPurchase(model, token);
        if (purchase) toggle();
    }; */

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
                    <Row className="StationCard__Row">
                        <Col sm="12" md="7">
                            Chart
                        </Col>
                        <Col sm="12" md="5">
                            <Form id="calculator-form">
                                <Row>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Label for="amount">Amount, $</Label>
                                            {/* eslint-disable-next-line max-len */}
                                            <Input type="number" name="amount" id="amount" placeholder="" value={formModel.Amount} onChange={(e) => handleChangeSliderAmount(_.get(e, 'target.value', 0))} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" md="6">
                                        <FormGroup className="form-group-slider">
                                            <Label for="amountSecondary" className="d-none">Amount, $</Label>
                                            {/* eslint-disable-next-line max-len */}
                                            <Slider id="amountSecondary" name="amountSecondary" {...limits} marks={{ [limits.min]: limits.min, [limits.max]: limits.max }} value={formModel.Amount} handle={handle} onChange={handleChangeSliderAmount} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Label for="powerAmount">Power amount, kwt</Label>
                                            <Input type="text" name="powerAmount" id="powerAmount" placeholder="-" value={formModel.KilowattAmount} readOnly />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Label for="paymentAmount">Payment Amount, $ (mon.)</Label>
                                            <Input type="text" name="paymentAmount" id="paymentAmount" placeholder="-" value={formModel.PaymentAmount} readOnly />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Label for="roi">ROI, %</Label>
                                            <Input type="text" name="roi" id="roi" placeholder="-" value={formModel.Roi} readOnly />
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Label for="investmentReturn">Investment return</Label>
                                            <Input type="text" name="investmentReturn" id="investmentReturn" placeholder="-" value={formModel.EndInvestmentDate} readOnly />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Button className="btn btn-success" block onClick={() => console.log('Calculate')}>Buy</Button>
                                        </FormGroup>
                                    </Col>
                                    <Col sm="12" md="6">
                                        <FormGroup>
                                            <Button className="btn btn-success" block onClick={() => console.log('Deposit')}>Deposit</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}

StationCard.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    station: PropTypes.object.isRequired,
    authInfo: PropTypes.instanceOf(AuthInfoModel).isRequired,
};
