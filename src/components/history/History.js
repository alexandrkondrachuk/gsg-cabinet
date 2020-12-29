import React, { useEffect } from 'react';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { Scrollbars } from 'react-custom-scrollbars';
import * as cn from 'classnames';
import Transport from '../../classes/Transport';
import { t } from '../../lang';
import Types from '../../classes/Types';
import { config } from '../../config';
import { app as appActions } from '../../store/actions';

import './History.scss';

const dateFormatLong = config.get('dateFormatLong');
const numberFormat = config.get('numberFormat');

const operationTypes = Types.operationType;

function History({ token, dispatch, operations }) {
    useEffect(async () => {
        const historyResponse = await Transport.getFinancialOperations(token);
        dispatch(appActions.setHistory(historyResponse));
    }, [token]);
    const formatNumber = (value) => (numeral(value).format(numberFormat).replace(/,/g, ' '));
    return (
        <div className="History container">
            <h2 className="History__Title">{t('History of financial transactions')}</h2>
            <div className="Table">
                <div className="Table_Header">
                    <div className="Table_Cell Table_Cell_SM">#</div>
                    <div className="Table_Cell">{t('Type of transaction')}</div>
                    <div className="Table_Cell">{t('Power station')}</div>
                    <div className="Table_Cell">
                        {t('Purchased power')}
                        ,
                        {' '}
                        {t('kwt')}
                    </div>
                    <div className="Table_Cell">
                        {t('Price')}
                        , $
                    </div>
                    <div className="Table_Cell">
                        {t('Amount')}
                        , $
                    </div>
                    <div className="Table_Cell">{t('Date of operation')}</div>
                </div>
                <div className="Table_Body">
                    <Scrollbars>
                        {operations
                        && operations.map((operation) => (
                            <div className="Table_Row" key={_.get(operation, 'Id', '-')}>
                                <div className="Table_Cell Table_Cell_SM">{_.get(operation, 'Id', '-')}</div>
                                <div
                                    className="Table_Cell"
                                >
                                    {t(operationTypes[_.get(operation, 'OperationType', '1')])}
                                </div>
                                <div className="Table_Cell">{_.get(operation, 'PowerPlant.StationName', '-')}</div>
                                <div className="Table_Cell">{formatNumber(_.get(operation, 'KilowattAmount', 0))}</div>
                                <div className="Table_Cell">{formatNumber(_.get(operation, 'Price', 0))}</div>
                                {/* eslint-disable-next-line max-len */}
                                <div className={cn({
                                    // eslint-disable-next-line max-len
                                    Table_Cell: true, positive: (_.get(operation, 'Sum', 0) > 0), negative: (_.get(operation, 'Sum', 0) < 0), zero: (_.get(operation, 'Sum', 0) === 0),
                                })}
                                >
                                    {formatNumber(_.get(operation, 'Sum', 0))}
                                </div>
                                <div
                                    className="Table_Cell"
                                >
                                    {moment(_.get(operation, 'CreationDate', moment())).format(dateFormatLong)}
                                </div>
                            </div>
                        ))}
                        {(operations.length === 0) && (
                            <div className="Table_Row">
                                <div className="Table_Cell">{t('No data available')}</div>
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    const token = _.get(state.app, 'authInfo.access_token');
    const operations = _.get(state.app, 'history', []);
    return { token, operations };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

History.propTypes = {
    token: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    operations: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
