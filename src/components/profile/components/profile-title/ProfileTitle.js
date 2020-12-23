import React from 'react';
import * as PropTypes from 'prop-types';
import UserAvatar from 'react-user-avatar';
import { CardSubtitle, CardTitle } from 'reactstrap';
import avatarURL from '../../../../assets/images/icons/avatars/256_3.png';

export default function ProfileTitle({ firstName, lastName, login }) {
    return (
        <>
            <UserAvatar className="Profile__Avatar" size="72" name={`${firstName} ${lastName}`} src={avatarURL} />
            <CardTitle tag="h6" className="Profile__Login text-truncate">{login}</CardTitle>
            <CardSubtitle tag="p" className="Profile__FullName text-truncate">
                {firstName}
                {' '}
                {lastName}
            </CardSubtitle>
        </>
    );
}

ProfileTitle.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
};
