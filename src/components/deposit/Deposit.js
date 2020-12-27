import React, { useState } from 'react';
import {
    Container, Row, Col,
    Form, FormGroup, Label, Input, Button, FormText,
} from 'reactstrap';
import { ReactSVG } from 'react-svg';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { t } from '../../lang';
import bitcoin from '../../assets/images/icons/bitcoin.svg';
import Transport from '../../classes/Transport';
import { app as appActions } from '../../store/actions';

import './Deposit.scss';

function Deposit({ token, BTCAddress, dispatch }) {
    const [BTCStatus, setBTCStatus] = useState(false);
    const getBTCAddress = async (e) => {
        setBTCStatus(!BTCStatus);
        e.preventDefault();
        const btcAddressResponse = await Transport.getBTCAddress(token);
        dispatch(appActions.updateUserInfo({
            BTCAddress: btcAddressResponse,
        }));
    };
    const copyBTCAddress = () => {
        console.log('Copy BTC Address');
    };
    return (
        <div className="Deposit">
            <div className="Deposit__Card">
                <Container>
                    <Row>
                        <Col xs={12} lg={6}>
                            <Form id="BTCForm" onSubmit={getBTCAddress}>
                                <FormGroup>
                                    <FormText>{ t('Generate BTC address') }</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="BTCAddress" className="d-none">{ t('BTC Address') }</Label>
                                    <Input type="text" name="BTCAddress" id="BTCAddress" readOnly value={BTCAddress} />
                                </FormGroup>
                                <FormGroup>
                                    <Button disabled={BTCStatus || !!BTCAddress}>{ t('Generate') }</Button>
                                    <CopyToClipboard text={BTCAddress} onCopy={copyBTCAddress}>
                                        <Button>{ t('Copy') }</Button>
                                    </CopyToClipboard>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ReactSVG src={bitcoin} className="bitcoin-icon" />
        </div>
    );
}

const mapStateToProps = (state) => {
    const BTCAddress = _.get(state.app, 'userInfo.BTCAddress', '');
    const token = _.get(state.app, 'authInfo.access_token');
    return { token, BTCAddress };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

Deposit.propTypes = {
    token: PropTypes.string.isRequired,
    BTCAddress: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
