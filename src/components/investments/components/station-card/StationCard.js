import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import {
    Row, Col,
    Card, CardBody,
} from 'reactstrap';
import {
    StationThumbnail, StationDetails, StationChart, StationCalculator,
} from './components';
import StationCalculatorModel from '../../../../models/station-calculator-model';
import AuthInfoModel from '../../../../models/auth-info-model';
import Transport from '../../../../classes/Transport';

import './StationCard.scss';
import UserInfoModel from '../../../../models/user-info-model';

export default function StationCard({
    station, toggle, authInfo, userInfo, lang,
}) {
    const [calculatorModel, setCalculatorModel] = useState(new StationCalculatorModel());
    const setCalculatorModelValue = (newState = null) => {
        if (!newState) return;
        setCalculatorModel({ ...calculatorModel, ...newState });
    };

    const doInvest = async () => {
        const token = _.get(authInfo, 'access_token', null);
        const model = {
            UserId: '',
            PowerPlantId: _.get(station, 'Id', ''),
            KilowattAmount: _.get(calculatorModel, 'KilowattAmount', 0),
        };
        // eslint-disable-next-line no-return-await
        return await Transport.doPurchase(model, token);
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
};
