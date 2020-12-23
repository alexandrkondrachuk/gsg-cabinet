import React from 'react';
import * as PropTypes from 'prop-types';
import {
    Button, Card, CardBody, CardSubtitle, UncontrolledCollapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';
import numeral from 'numeral';
import { t } from '../../../../lang';
import { config } from '../../../../config';
import Types from '../../../../classes/Types';

const numberFormat = config.get('numberFormat');
const depositTab = Types.tabsMap.get(5);

export default function Balance({ balance, toggle }) {
    const doDeposit = () => {
        toggle(depositTab.id.toString());
    };
    return (
        <CardSubtitle tag="div" className="mb-2 text-muted w-100">
            <Button color="success" id="balance" block>
                <FontAwesomeIcon icon={faMoneyCheckAlt} />
                { ' ' }
                { t('Balance') }
            </Button>
            <UncontrolledCollapse toggler="#balance">
                <Card className="Balance text-center">
                    <CardBody>
                        <div className="Balance__Value">
                            { t('Balance') }
                            &nbsp;
                            { ':' }
                            &nbsp;
                            { numeral(balance).format(numberFormat).replace(',', ' ') }
                            &nbsp;
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <div className="Balance__Action text-center">
                            <Button className="btn btn-success" onClick={doDeposit}>{ t('Deposit') }</Button>
                        </div>
                    </CardBody>
                </Card>
            </UncontrolledCollapse>
        </CardSubtitle>
    );
}

Balance.propTypes = {
    balance: PropTypes.number.isRequired,
    toggle: PropTypes.func.isRequired,
};
