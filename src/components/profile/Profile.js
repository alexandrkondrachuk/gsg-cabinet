import React from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
    Container, Row, Col,
    Card, CardBody, UncontrolledCollapse,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, CustomInput,
} from 'reactstrap';
import UserAvatar from 'react-user-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLock, faMoneyCheckAlt, faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';
import numeral from 'numeral';
import { config } from '../../config';
import { t } from '../../lang';
import Types from '../../classes/Types';
import UserInfoModel from '../../models/user-info-model';

import avatarURL from '../../assets/images/icons/avatars/256_3.png';

import './Profile.scss';

const numberFormat = config.get('numberFormat');
const depositTab = Types.tabsMap.get(5);

function Profile({ userInfo, toggle }) {
    // @todo move variables to the model
    const login = _.get(userInfo, 'Email', 'user@gmail.com');
    const firstName = _.get(userInfo, 'FirstName', 'Dear');
    const lastName = _.get(userInfo, 'LastName', 'User');
    const phoneNumber = _.get(userInfo, 'PhoneNumber', '');
    const birthDate = _.get(userInfo, 'BirthDate', '1970-01-01');
    const balance = _.get(userInfo, 'Balance', 0);

    const intl = useIntl();

    const doDeposit = () => {
        toggle(depositTab.id.toString());
    };

    const doChangePassword = (e) => {
        // @todo implement change user password
        // @todo add model for the form
        e.preventDefault();
        console.log('Do change user password');
    };

    const doChangeProfile = (e) => {
        // @todo implement change user profile
        // @todo add model for the form
        e.preventDefault();
        console.log('Do change user profile');
    };

    return (
        <div className="Profile">
            <Container>
                <Card className="Profile__Card">
                    <CardBody>
                        <Row>
                            <Col md="12" lg="5">
                                <div className="Profile__Column">
                                    <UserAvatar className="Profile__Avatar" size="72" name={`${firstName} ${lastName}`} src={avatarURL} />
                                    <CardTitle tag="h6" className="Profile__Login text-truncate">{login}</CardTitle>
                                    <CardSubtitle tag="p" className="Profile__FullName text-truncate">
                                        {firstName}
                                        {' '}
                                        {lastName}
                                    </CardSubtitle>
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
                                    <CardSubtitle tag="div" className="mb-2 text-muted w-100">
                                        <Button color="danger" id="change-password" block>
                                            <FontAwesomeIcon icon={faLock} />
                                            {' '}
                                            { t('Password') }
                                        </Button>
                                        <UncontrolledCollapse toggler="#change-password">
                                            <Card className="ChangePassword">
                                                <CardBody>
                                                    <Form id="changePassword" onSubmit={doChangePassword}>
                                                        <FormGroup>
                                                            <Label for="OldPassword" className="d-none">{ t('Old Password') }</Label>
                                                            <Input type="password" name="OldPassword" id="OldPassword" placeholder={intl.formatMessage({ id: 'Old Password' })} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="NewPassword" className="d-none">{ t('New Password') }</Label>
                                                            <Input type="password" name="NewPassword" id="NewPassword" placeholder={intl.formatMessage({ id: 'New Password' })} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="RepeatNewPassword" className="d-none">{ t('Repeat New Password') }</Label>
                                                            {/* eslint-disable-next-line max-len */}
                                                            <Input type="password" name="RepeatNewPassword" id="RepeatNewPassword" placeholder={intl.formatMessage({ id: 'Repeat New Password' })} />
                                                        </FormGroup>
                                                        <FormGroup className="text-center">
                                                            <Button className="btn btn-danger">{ t('Change Password') }</Button>
                                                        </FormGroup>
                                                    </Form>
                                                </CardBody>
                                            </Card>
                                        </UncontrolledCollapse>
                                    </CardSubtitle>
                                </div>
                            </Col>
                            <Col md="12" lg="7">
                                <div className="Profile__Column">
                                    <h6 className="Profile__Details__Title">{ t('Profile details') }</h6>
                                    <Form id="changeProfile" onSubmit={doChangeProfile}>
                                        <FormGroup>
                                            <Label for="FirstName">{ t('First Name') }</Label>
                                            <Input type="text" name="FirstName" id="FirstName" placeholder={firstName} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="LastName">{ t('Last Name') }</Label>
                                            <Input type="text" name="LastName" id="LastName" placeholder={lastName} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Email">{ t('Email') }</Label>
                                            <Input type="email" name="Email" id="Email" placeholder={login} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="PhoneNumber">{ t('Phone Number') }</Label>
                                            <Input type="tel" name="PhoneNumber" id="PhoneNumber" placeholder={phoneNumber} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="BirthDate">{ t('Birth Date') }</Label>
                                            <Input
                                                type="date"
                                                name="BirthDate"
                                                id="BirthDate"
                                                placeholder={birthDate}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Sex">{ t('Gender') }</Label>
                                            <CustomInput type="select" id="Sex" name="Sex">
                                                <option value="1">{ intl.formatMessage({ id: 'Male' }) }</option>
                                                <option value="2">{ intl.formatMessage({ id: 'Female' }) }</option>
                                            </CustomInput>
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Button className="btn btn-success">{ t('Change Profile') }</Button>
                                        </FormGroup>
                                    </Form>
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
    return { userInfo };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

Profile.propTypes = {
    userInfo: PropTypes.instanceOf(UserInfoModel).isRequired,
    toggle: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
