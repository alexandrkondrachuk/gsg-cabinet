import React from 'react';
import * as PropTypes from 'prop-types';

export default function StationThumbnail({ src, name }) {
    return (
        <div className="StationCard__Col">
            <img className="StationCard__Thumbnail" src={src} alt={name} />
        </div>
    );
}

StationThumbnail.propTypes = {
    src: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};
