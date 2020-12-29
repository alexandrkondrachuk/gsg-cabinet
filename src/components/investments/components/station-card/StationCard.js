import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import {
    Row, Col,
    Card, CardBody,
} from 'reactstrap';
import numeral from 'numeral';
import {
    StationThumbnail, StationDetails, StationChart, StationCalculator,
} from './components';
import StationCalculatorModel from '../../../../models/station-calculator-model';
import AuthInfoModel from '../../../../models/auth-info-model';
import Transport from '../../../../classes/Transport';

import './StationCard.scss';
import UserInfoModel from '../../../../models/user-info-model';
import { app as appActions } from '../../../../store/actions/app';
import { config } from '../../../../config';

const numberFormat = config.get('numberFormat');
const formatNumber = (value) => (numeral(value).format(numberFormat).replace(/,/g, ' '));

export default function StationCard({
    station, toggle, authInfo, userInfo, lang, dispatch,
}) {
    const [calculatorModel, setCalculatorModel] = useState(new StationCalculatorModel());
    const setCalculatorModelValue = (newState = null) => {
        if (!newState) return;
        setCalculatorModel({ ...calculatorModel, ...newState });
    };
    const updateMainBalance = (balance = 0, elementId = 'user-balance') => {
        const balanceElement = document.getElementById(elementId);
        if (balanceElement) {
            balanceElement.innerText = formatNumber(balance);
        }
    };

    const doInvest = async () => {
        const token = _.get(authInfo, 'access_token', null);
        const model = {
            UserId: '',
            PowerPlantId: _.get(station, 'Id', ''),
            KilowattAmount: _.get(calculatorModel, 'KilowattAmount', 0),
        };
        const investResult = await Transport.doPurchase(model, token);
        if (typeof investResult === 'number') {
            // Update userData, #id element
            const userModel = await Transport.getUserData(authInfo);
            dispatch(appActions.getUserInfo(new UserInfoModel(userModel)));
            updateMainBalance(_.get(userModel, 'Balance', 0));
            // Update History
            const historyResponse = await Transport.getFinancialOperations(token);
            dispatch(appActions.setHistory(historyResponse));
            // Update Purchase
            const purchasesResponse = await Transport.getPurchases(token);
            dispatch(appActions.setPurchases(purchasesResponse));
        }
        // eslint-disable-next-line no-return-await
        return investResult;
    };

    return (
        <div className="StationCard">
            <Card>
                <Row className="StationCard__Row">
                    <Col sm="12" md="7">
                        <StationThumbnail src={_.get(station, 'fimg_url')} name={_.get(station, 'StationName', 'Station Name')} />
                    </Col>
                    <Col sm="12" md="5">
                        <StationDetails station={station} />
                    </Col>
                </Row>
                <CardBody>
                    <Row className="StationCard__Row">
                        <Col sm="12" md="7">
                            <StationChart model={calculatorModel} lang={lang} />
                        </Col>
                        <Col sm="12" md="5">
                            <StationCalculator
                                model={calculatorModel}
                                userInfo={userInfo}
                                station={station}
                                setModelValue={setCalculatorModelValue}
                                toggle={toggle}
                                doInvest={doInvest}
                            />
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
    userInfo: PropTypes.instanceOf(UserInfoModel).isRequired,
    toggle: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};
