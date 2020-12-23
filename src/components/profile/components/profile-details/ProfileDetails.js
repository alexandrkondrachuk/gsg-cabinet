import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import * as validator from 'validator';
import {
    Button, CustomInput, Form, FormGroup, Input, Label,
} from 'reactstrap';
import { useIntl } from 'react-intl';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as cn from 'classnames';
import { t } from '../../../../lang';
import Transport from '../../../../classes/Transport';
import ProfileDetailsModel from '../../../../models/profile-details-model';

export default function ProfileDetails({
    firstName: FirstName, lastName: LastName, phoneNumber: PhoneNumber, birthDate: BirthDate, sex: Sex, token,
}) {
    const intl = useIntl();
    const [profileDetails, setProfileDetails] = useState(new ProfileDetailsModel({
        FirstName,
        LastName,
        PhoneNumber,
        BirthDate,
        Sex,
    }));
    const [read, setRead] = useState({
        FirstName: true,
        LastName: true,
        PhoneNumber: true,
        BirthDate: true,
        Sex: true,
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [resultError, setResultError] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);
    const validation = {
        FirstName: (value) => validator.isLength(value, { min: 3, max: 100 }),
        LastName: (value) => validator.isLength(value, { min: 3, max: 100 }),
        PhoneNumber: (value) => validator.isMobilePhone(value),
        BirthDate: (value) => validator.isDate(value),
        Sex: (value) => ['1', '2'].includes(value.toString()),
    };
    useEffect(() => {
        // eslint-disable-next-line max-len
        if ((FirstName !== profileDetails.FirstName) || (LastName !== profileDetails.LastName) || (PhoneNumber !== profileDetails.PhoneNumber) || (BirthDate !== profileDetails.BirthDate) || (Sex !== profileDetails.Sex)) {
            setProfileDetails(new ProfileDetailsModel({
                FirstName,
                LastName,
                PhoneNumber,
                BirthDate,
                Sex,
            }));
        }
    }, [FirstName,
        LastName,
        PhoneNumber,
        BirthDate,
        Sex]);
    const doChangeProfile = async (e) => {
        e.preventDefault();
        const update = await Transport.updateUserData(profileDetails, token);
        if (typeof update === 'boolean') {
            setResultSuccess(true);
        } else {
            setResultError(true);
        }
    };
    const doEditField = (target = null) => {
        if (!target) return;
        setRead({ ...read, [target]: !read[target] });
    };
    const handleField = (e) => {
        const name = _.get(e, 'target.name', null);
        const value = _.get(e, 'target.value', null);
        if (typeof name !== 'string' || typeof value !== 'string') return;
        setTouched({ ...touched, [name]: true });
        if (!validation[name](value)) {
            setErrors({ ...errors, [name]: true });
        } else {
            // eslint-disable-next-line no-underscore-dangle
            delete errors[name];
            setErrors({ ...errors });
        }
        setProfileDetails({ ...profileDetails, [name]: value });
    };

    return (
        <>
            <h6 className="Profile__Details__Title">{t('Profile details')}</h6>
            <Form id="changeProfile" onSubmit={doChangeProfile}>
                <FormGroup className={cn({ editable: !read.FirstName })}>
                    <Label for="FirstName">{t('First Name')}</Label>
                    <Input
                        type="text"
                        name="FirstName"
                        id="FirstName"
                        value={profileDetails.FirstName}
                        readOnly={read.FirstName}
                        className={cn({ error: _.get(errors, 'FirstName', false) })}
                        onChange={handleField}
                    />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="edit-field" onClick={() => doEditField('FirstName')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
                </FormGroup>
                <FormGroup className={cn({ editable: !read.LastName })}>
                    <Label for="LastName">{t('Last Name')}</Label>
                    <Input
                        type="text"
                        name="LastName"
                        id="LastName"
                        value={profileDetails.LastName}
                        readOnly={read.LastName}
                        className={cn({ error: _.get(errors, 'LastName', false) })}
                        onChange={handleField}
                    />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="edit-field" onClick={() => doEditField('LastName')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
                </FormGroup>
                <FormGroup className={cn({ editable: !read.PhoneNumber })}>
                    <Label for="PhoneNumber">{t('Phone Number')}</Label>
                    <Input
                        type="tel"
                        name="PhoneNumber"
                        id="PhoneNumber"
                        value={profileDetails.PhoneNumber}
                        readOnly={read.PhoneNumber}
                        className={cn({ error: _.get(errors, 'PhoneNumber', false) })}
                        onChange={handleField}
                    />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="edit-field" onClick={() => doEditField('PhoneNumber')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
                </FormGroup>
                <FormGroup className={cn({ editable: !read.BirthDate })}>
                    <Label for="BirthDate">{t('Birth Date')}</Label>
                    <Input
                        type="date"
                        name="BirthDate"
                        id="BirthDate"
                        value={profileDetails.BirthDate}
                        readOnly={read.BirthDate}
                        className={cn({ error: _.get(errors, 'BirthDate', false) })}
                        onChange={handleField}
                    />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="edit-field" onClick={() => doEditField('BirthDate')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
                </FormGroup>
                <FormGroup className={cn({ editable: !read.Sex })}>
                    <Label for="Sex">{t('Gender')}</Label>
                    <CustomInput
                        type="select"
                        id="Sex"
                        name="Sex"
                        value={profileDetails.Sex}
                        disabled={read.Sex}
                        className={cn({ error: _.get(errors, 'Sex', false) })}
                        onChange={handleField}
                    >
                        <option value="1">{intl.formatMessage({ id: 'Male' })}</option>
                        <option value="2">{intl.formatMessage({ id: 'Female' })}</option>
                    </CustomInput>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="edit-field" onClick={() => doEditField('Sex')}>
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
                </FormGroup>
                <FormGroup className="text-center">
                    <Button
                        className="btn btn-success"
                        disabled={(Object.keys(errors).length > 0) || !(Object.keys(touched).length > 0)}
                    >
                        {t('Change Profile')}
                    </Button>
                </FormGroup>
                {resultError && (
                    <FormGroup className="text-center message message-error">
                        <p>{t('Internal server error')}</p>
                    </FormGroup>
                )}
                {resultSuccess && (
                    <FormGroup className="text-center message message-success">
                        <p>{t('Profile has been updated successfully')}</p>
                    </FormGroup>
                )}
            </Form>
        </>
    );
}

ProfileDetails.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    sex: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
};
