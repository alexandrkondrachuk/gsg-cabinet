import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import numeral from 'numeral';
import moment from 'moment';
import { t } from '../../lang';
import Transport from '../../classes/Transport';
import { config } from '../../config';
import { app as appActions } from '../../store/actions';

import './Purchase.scss';

const numberFormat = config.get('numberFormat');
const dateFormatLong = config.get('dateFormatLong');
const formatNumber = (value) => (numeral(value).format(numberFormat).replace(/,/g, ' '));

function Purchase({ token, dispatch, purchases }) {
    const [modal, setModal] = useState(false);
    const [currentPurchase, setPurchase] = useState(null);
    useEffect(async () => {
        const purchasesResponse = await Transport.getPurchases(token);
        dispatch(appActions.setPurchases(purchasesResponse));
    }, []);
    const toggle = () => setModal(!modal);
    const openDetails = (purchase) => {
        setPurchase(purchase);
        toggle();
    };

    return (
        <div className="Purchase container">
            <h2 className="Purchase__Title">{t('My purchases')}</h2>
            <div className="Table">
                <div className="Table_Header">
                    <div className="Table_Cell Table_Cell_SM">#</div>
                    <div className="Table_Cell">{t('Power station')}</div>
                    <div className="Table_Cell">
                        {t('Purchased power')}
                        ,
                        &nbsp;
                        {t('kwt')}
                    </div>
                    <div className="Table_Cell">
                        {t('Investment amount')}
                        ,
                        <br />
                        $
                    </div>
                    <div className="Table_Cell">
                        {t('Dividend')}
                        ,
                        <br />
                        $
                    </div>
                    <div className="Table_Cell">{t('Date of operation')}</div>
                    <div className="Table_Cell">{t('Details')}</div>
                </div>
                <div className="Table_Body">
                    <Scrollbars>
                        {purchases && purchases.map((purchase) => (
                            <div key={purchase.Id} className="Table_Row">
                                <div className="Table_Cell Table_Cell_SM">{_.get(purchase, 'Id')}</div>
                                <div className="Table_Cell">{_.get(purchase, 'PowerPlant.StationName', '')}</div>
                                <div className="Table_Cell">{formatNumber(_.get(purchase, 'KilowattAmount', 0))}</div>
                                <div className="Table_Cell">{formatNumber(_.get(purchase, 'Sum', 0))}</div>
                                <div className="Table_Cell">{formatNumber(_.get(purchase, 'Dividends', 0))}</div>
                                <div
                                    className="Table_Cell"
                                >
                                    {moment(_.get(purchase, 'CreationDate', moment())).format(dateFormatLong)}
                                </div>
                                <div className="Table_Cell">
                                    <Button
                                        onClick={() => openDetails(purchase)}
                                    >
                                        {t('Look')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {(purchases.length === 0) && (
                            <div className="Table_Row">
                                <div className="Table_Cell">{t('No data available')}</div>
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </div>
            {currentPurchase && (
                <Modal isOpen={modal} toggle={toggle} className="Deposit__Modal">
                    <ModalHeader toggle={toggle}>{_.get(currentPurchase, 'PowerPlant.StationName', '')}</ModalHeader>
                    <ModalBody>
                        <h2>{t('Dividends list')}</h2>
                        <div className="List">
                            {_.get(currentPurchase, 'DividendsList', null) && (
                                _.get(currentPurchase, 'DividendsList', []).map((d) => (
                                    <div key={d.Id} className="List_El">
                                        <div className="List_Col">
                                            <div className="List_Key">
                                                #
                                            </div>
                                            <div className="List_Val">
                                                {_.get(d, 'Id', '')}
                                            </div>
                                        </div>
                                        <div className="List_Col">
                                            <div className="List_Key">
                                                {t('Amount')}
                                                , $
                                            </div>
                                            <div className="List_Val">
                                                {formatNumber(_.get(d, 'Sum', 0))}
                                            </div>
                                        </div>
                                        <div className="List_Col">
                                            <div className="List_Key">
                                                {t('Date of operation')}
                                            </div>
                                            <div className="List_Val">
                                                {moment(_.get(d, 'CreationDate', '')).format(dateFormatLong)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>{t('Close')}</Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    const token = _.get(state.app, 'authInfo.access_token');
    const purchases = _.get(state.app, 'purchases', []);
    return { token, purchases };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

Purchase.propTypes = {
    token: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    purchases: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
