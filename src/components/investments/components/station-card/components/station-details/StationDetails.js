import React from 'react';
import * as PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBatteryQuarter, faCalendarAlt,
    faFileSignature, faHandHoldingUsd,
    faMapMarkedAlt,
    faPercentage,
    faTags,
} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import { t } from '../../../../../../lang';
import { config } from '../../../../../../config';

const dateFormat = config.get('dateFormat');
const numberShortFormat = config.get('numberShortFormat');

export default function StationDetails({ station }) {
    return (
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
    );
}

StationDetails.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    station: PropTypes.object.isRequired,
};
