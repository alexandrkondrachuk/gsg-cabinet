import React from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
    Container, Row, Col,
    Card, CardBody,
} from 'reactstrap';
import UserInfoModel from '../../models/user-info-model';
import {
    Balance, Verification, PasswordChange, ProfileTitle, ProfileDetails,
} from './components';

import './Profile.scss';

function Profile({ userInfo, toggle, token }) {
    const login = _.get(userInfo, 'Email', 'user@gmail.com');
    const firstName = _.get(userInfo, 'FirstName', 'Dear');
    const lastName = _.get(userInfo, 'LastName', 'User');
    const phoneNumber = _.get(userInfo, 'PhoneNumber', '');
    const balance = _.get(userInfo, 'Balance', 0);
    const sex = _.get(userInfo, 'Sex', 1);
    let birthDate = _.get(userInfo, 'BirthDate');
    birthDate = (typeof birthDate !== 'string') ? '1970-01-01' : birthDate;
    birthDate = birthDate.includes('T') ? _.get(birthDate.split('T'), '[0]', '1970-01-01') : birthDate;

    return (
        <div className="Profile">
            <Container>
                <Card className="Profile__Card">
                    <CardBody>
                        <Row>
                            <Col md="12" lg="5">
                                <div className="Profile__Column">
                                    <ProfileTitle login={login} lastName={lastName} firstName={firstName} />
                                    <Balance balance={balance} toggle={toggle} />
                                    <Verification />
                                    <PasswordChange token={token} />
                                </div>
                            </Col>
                            <Col md="12" lg="7">
                                <div className="Profile__Column">
                                    <ProfileDetails phoneNumber={phoneNumber} birthDate={birthDate} lastName={lastName} firstName={firstName} sex={sex} token={token} />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    const userInfo = _.get(state.app, 'userInfo');
    const token = _.get(state.app, 'authInfo.access_token');
    return { userInfo, token };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

Profile.propTypes = {
    userInfo: PropTypes.instanceOf(UserInfoModel).isRequired,
    token: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
