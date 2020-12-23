import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import {
    Button, Card, CardBody, CardSubtitle, Form, FormGroup, Input, Label, UncontrolledCollapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { useIntl } from 'react-intl';
import { t } from '../../../../lang';
import ChangePasswordModel from '../../../../models/change-password-model';
import Transport from '../../../../classes/Transport';
import Register from '../../../../classes/register';
import RegisterSession from '../../../../classes/register-session';
import { config } from '../../../../config';

const storageAuth = config.get('storage.auth');

export default function PasswordChange({ token }) {
    const intl = useIntl();
    const [passwordModel, setPasswordModel] = useState(new ChangePasswordModel());
    const [passwordError, setPasswordError] = useState({ show: false, message: '' });
    const [passwordSuccess, setPasswordSuccess] = useState({ show: false, message: '' });

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
            setPasswordError({
                ...passwordError,
                show: true,
                message: 'Password must be at least 6 characters and maximum 100',
            });
        } else if (!isEqual) {
            setPasswordError({
                ...passwordError,
                show: true,
                message: 'Password and password confirmation do not match',
            });
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
    return (
        <CardSubtitle tag="div" className="mb-2 text-muted w-100">
            <Button color="danger" id="change-password" block>
                <FontAwesomeIcon icon={faLock} />
                {' '}
                {t('Password')}
            </Button>
            <UncontrolledCollapse toggler="#change-password">
                <Card className="ChangePassword">
                    <CardBody>
                        <Form id="changePassword" onSubmit={doChangePassword}>
                            <FormGroup>
                                <Label for="OldPassword" className="d-none">{t('Old Password')}</Label>
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
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowOldPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </span>
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowOldPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    </span>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label for="NewPassword" className="d-none">{t('New Password')}</Label>
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
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowNewPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </span>
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowNewPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    </span>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label for="ConfirmPassword" className="d-none">{t('Repeat New Password')}</Label>
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
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowConfirmPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </span>
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                    <span
                                        className="password-visibility"
                                        onClick={() => handleShowPasswordInput('ShowConfirmPassword')}
                                    >
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    </span>
                                )}
                            </FormGroup>
                            <FormGroup className="text-center">
                                <Button className="btn btn-danger">{t('Change Password')}</Button>
                            </FormGroup>
                            {passwordError.show && (
                                <FormGroup>
                                    <p className="error">{t(passwordError.message)}</p>
                                </FormGroup>
                            )}
                            {passwordSuccess.show && (
                                <FormGroup>
                                    <p className="success">{t(passwordSuccess.message)}</p>
                                </FormGroup>
                            )}
                        </Form>
                    </CardBody>
                </Card>
            </UncontrolledCollapse>
        </CardSubtitle>
    );
}

PasswordChange.propTypes = {
    token: PropTypes.string.isRequired,
};
