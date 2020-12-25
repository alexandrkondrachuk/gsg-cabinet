import React from 'react';
import './Investments.scss';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthInfoModel from '../../models/auth-info-model';
import { StationCard } from './components';
import UserInfoModel from '../../models/user-info-model';

function Investments({
    stations, authInfo, userInfo, toggle,
}) {
    return (
        <div className="Investments">
            {(stations && stations.length) && (
                stations.map((station) => (<StationCard key={station.Id} station={station} authInfo={authInfo} toggle={toggle} userInfo={userInfo} />))
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    const stations = _.get(state.app, 'stations');
    const authInfo = _.get(state.app, 'authInfo');
    const userInfo = _.get(state.app, 'userInfo');
    return { stations, authInfo, userInfo };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

Investments.defaultProps = {
    stations: null,
};

Investments.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    stations: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(null)]),
    authInfo: PropTypes.instanceOf(AuthInfoModel).isRequired,
    toggle: PropTypes.func.isRequired,
    userInfo: PropTypes.instanceOf(UserInfoModel).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Investments);
