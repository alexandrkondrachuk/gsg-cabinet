import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import {
    Container, Row, Col, Button,
} from 'reactstrap';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import * as cn from 'classnames';
import { ReactSVG } from 'react-svg';
import { t } from '../../lang';
import { Bitcoin, Card } from './methods';
import Types from '../../classes/Types';
import bitcoinIcon from '../../assets/images/icons/bitcoin.svg';
import creditCardIcon from '../../assets/images/icons/credit-card.svg';

import './Deposit.scss';

const methods = Types.withdrawalMethods;
const methodsFiltered = methods.filter((m) => !!m.enabled);
const activeIndex = (_.get(methodsFiltered, '[0].id', 0)).toString();

const methodsIcons = {
    bitcoinIcon,
    creditCardIcon,
};

function Deposit({ token }) {
    const [active, setActive] = useState(activeIndex);

    const renderMethod = (id) => {
        switch (id) {
        case '0':
            return (<Bitcoin />);
        case '1':
            return (<Card token={token} />);
        default:
            return (<Bitcoin />);
        }
    };
    return (
        <div className="Deposit">
            <div className="Deposit__Container">
                <Container>
                    <Row>
                        <h2 className="Deposit__Title">{t('Choose your deposit method')}</h2>
                        <div className="Deposit__Details">
                            <Row>
                                {(methodsFiltered && Array.isArray(methodsFiltered) && methodsFiltered.length > 0) && (
                                    // eslint-disable-next-line max-len
                                    methodsFiltered.map((m) => (
                                        <Col md={12} lg={6} key={m.id} className="Deposit__Method">
                                            {/* eslint-disable-next-line max-len */}
                                            <Button onClick={() => { setActive(m.id.toString()); }} block className={cn({ active: (active === m.id.toString()), Deposit__Method__Btn: true, [m.icon]: !!m.icon })}>
                                                <ReactSVG src={methodsIcons[m.icon]} className="Deposit__Method__Icon" />
                                                {t(m.name)}
                                            </Button>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>
                        { renderMethod(active) }
                    </Row>
                </Container>
            </div>
        </div>
    );
}

Deposit.propTypes = {
    token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    const BTCAddress = _.get(state.app, 'userInfo.BTCAddress', '');
    const token = _.get(state.app, 'authInfo.access_token');
    return { token, BTCAddress };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
