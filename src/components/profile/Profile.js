import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
    Container, Row, Col,
    Card, CardBody, UncontrolledCollapse,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, CustomInput, FormText,
} from 'reactstrap';
import UserAvatar from 'react-user-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLock, faMoneyCheckAlt, faDollarSign, faUserCheck, faEyeSlash, faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';
import numeral from 'numeral';
import { config } from '../../config';
import { t } from '../../lang';
import Types from '../../classes/Types';
import Transport from '../../classes/Transport';
import RegisterSession from '../../classes/register-session';
import Register from '../../classes/register';
import UserInfoModel from '../../models/user-info-model';
import ChangePasswordModel from '../../models/change-password-model';

import avatarURL from '../../assets/images/icons/avatars/256_3.png';

import './Profile.scss';

const numberFormat = config.get('numberFormat');
const depositTab = Types.tabsMap.get(5);
const storageAuth = config.get('storage.auth');

function Profile({ userInfo, token, toggle }) {
    // @todo move variables to the model
    const login = _.get(userInfo, 'Email', 'user@gmail.com');
    const firstName = _.get(userInfo, 'FirstName', 'Dear');
    const lastName = _.get(userInfo, 'LastName', 'User');
    const phoneNumber = _.get(userInfo, 'PhoneNumber', '');
    const birthDate = _.get(userInfo, 'BirthDate', '1970-01-01');
    const balance = _.get(userInfo, 'Balance', 0);
    const [passwordModel, setPasswordModel] = useState(new ChangePasswordModel());
    const [passwordError, setPasswordError] = useState({ show: false, message: '' });
    const [passwordSuccess, setPasswordSuccess] = useState({ show: false, message: '' });

    const intl = useIntl();

    const doDeposit = () => {
        toggle(depositTab.id.toString());
    };

    const handlePasswordInput = (e) => {
        const name = _.get(e, 'target.name', null);
        const value = _.get(e, 'target.value', null);

        if (!name || typeof value !== 'string') return;
        setPasswordModel({ ...passwordModel, [name]: value });
    };

    const handleShowPasswordInput = (target = null) => {
        if (!target) return;
        setPasswordModel({ ...passwordModel, [target]: !passwordModel[target] });
    };

    const doChangePassword = async (e) => {
        e.preventDefault();
        const validators = ChangePasswordModel.Validation;
        const inputsValidation = validators.map((v) => (v.validator(passwordModel[v.name])));
        const isValid = inputsValidation.every((v) => v);
        const isEqual = passwordModel.NewPassword === passwordModel.ConfirmPassword;

        if (!isValid) {
            setPasswordError({ ...passwordError, show: true, message: 'Password must be at least 6 characters and maximum 100' });
        } else if (!isEqual) {
            setPasswordError({ ...passwordError, show: true, message: 'Password and password confirmation do not match' });
        }

        if (!isValid || !isEqual) return;

        if (isValid && isEqual) {
            setPasswordError({ ...passwordError, show: false, message: '' });
        }

        const response = await Transport.changePassword(passwordModel, token);

        if (typeof response === 'boolean') {
            setPasswordError({ ...passwordError, show: false, message: '' });
            setPasswordSuccess({ ...passwordSuccess, show: true, message: 'Password changed successfully' });

            // Update storage
            if (Register.has(storageAuth)) {
                const local = Register.get(storageAuth);
                _.set(local, 'password', passwordModel.NewPassword);
                Register.set(storageAuth, local);
            }

            if (RegisterSession.has(storageAuth)) {
                const local = RegisterSession.get(storageAuth);
                _.set(local, 'password', passwordModel.NewPassword);
                RegisterSession.set(storageAuth, local);
            }
        } else {
            setPasswordSuccess({ ...passwordSuccess, show: false, message: '' });
            setPasswordError({ ...passwordError, show: true, message: 'Incorrect password' });
        }
    };

    const doChangeProfile = (e) => {
        // @todo implement change user profile
        // @todo add model for the form
        e.preventDefault();
        console.log('Do change user profile');
    };

    const doVerification = (e) => {
        // @todo implement file reading and send to the server
        // @todo add model for the form
        e.preventDefault();
        console.log('Do verification');
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
                                        <Button color="success" id="verification" block>
                                            <FontAwesomeIcon icon={faUserCheck} />
                                            { ' ' }
                                            { t('Verification') }
                                        </Button>
                                        <UncontrolledCollapse toggler="#verification">
                                            <Card className="Balance text-center">
                                                <CardBody>
                                                    <Form id="verification-form" onSubmit={doVerification}>
                                                        <FormGroup>
                                                            <Label for="passport">{t('Document type : Passport')}</Label>
                                                            <Input type="file" name="passport" id="passport" />
                                                            <FormText color="muted">
                                                                { t('Please attach a scanned copy of your passport for user verification.') }
                                                            </FormText>
                                                        </FormGroup>
                                                        <Button className="btn btn-success">{ t('Upload') }</Button>
                                                    </Form>
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
                                                            <Input
                                                                type={passwordModel.ShowOldPassword ? 'text' : 'password'}
                                                                name="OldPassword"
                                                                id="OldPassword"
                                                                placeholder={intl.formatMessage({ id: 'Old Password' })}
                                                                value={passwordModel.OldPassword}
                                                                onChange={handlePasswordInput}
                                                            />
                                                            {passwordModel.ShowOldPassword ? (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowOldPassword')}>
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </span>
                                                            ) : (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowOldPassword')}>
                                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                                </span>
                                                            )}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="NewPassword" className="d-none">{ t('New Password') }</Label>
                                                            <Input
                                                                type={passwordModel.ShowNewPassword ? 'text' : 'password'}
                                                                name="NewPassword"
                                                                id="NewPassword"
                                                                placeholder={intl.formatMessage({ id: 'New Password' })}
                                                                value={passwordModel.NewPassword}
                                                                onChange={handlePasswordInput}
                                                            />
                                                            {passwordModel.ShowNewPassword ? (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowNewPassword')}>
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </span>
                                                            ) : (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowNewPassword')}>
                                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                                </span>
                                                            )}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="ConfirmPassword" className="d-none">{ t('Repeat New Password') }</Label>
                                                            <Input
                                                                type={passwordModel.ShowConfirmPassword ? 'text' : 'password'}
                                                                name="ConfirmPassword"
                                                                id="ConfirmPassword"
                                                                placeholder={intl.formatMessage({ id: 'Repeat New Password' })}
                                                                value={passwordModel.ConfirmPassword}
                                                                onChange={handlePasswordInput}
                                                            />
                                                            {passwordModel.ShowConfirmPassword ? (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowConfirmPassword')}>
                                                                    <FontAwesomeIcon icon={faEye} />
                                                                </span>
                                                            ) : (
                                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                                <span className="password-visibility" onClick={() => handleShowPasswordInput('ShowConfirmPassword')}>
                                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                                </span>
                                                            )}
                                                        </FormGroup>
                                                        <FormGroup className="text-center">
                                                            <Button className="btn btn-danger">{ t('Change Password') }</Button>
                                                        </FormGroup>
                                                        {passwordError.show && (
                                                            <FormGroup>
                                                                <p className="error">{ t(passwordError.message) }</p>
                                                            </FormGroup>
                                                        )}
                                                        {passwordSuccess.show && (
                                                            <FormGroup>
                                                                <p className="success">{ t(passwordSuccess.message) }</p>
                                                            </FormGroup>
                                                        )}
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
