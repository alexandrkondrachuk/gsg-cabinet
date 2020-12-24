import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    UncontrolledCollapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { t } from '../../../../lang';
import FileModel from '../../../../models/file-model';
import Transport from '../../../../classes/Transport';

import './Verification.scss';

export default function Verification({ verification, token, updateUserInfo }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const doVerification = async (e) => {
        e.preventDefault();
        const uploadResult = await Transport.uploadUserFile(selectedFile, token);
        const model = { VerificationStatus: 2 };

        if ((typeof uploadResult === 'boolean')) {
            updateUserInfo(model);
        }
    };

    const convertBase64 = (file) => new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (() => {
            resolve(fileReader.result);
        });
        fileReader.onerror = ((err) => {
            reject(err);
        });
    });

    const fileSelectedHandler = async (e) => {
        const file = _.get(e, 'target.files[0]');
        const FileName = _.get(file, 'name');
        const base64 = await convertBase64(file);
        const Base64Data = base64;
        const model = new FileModel({
            FileName,
            Base64Data,
        });
        setSelectedFile(model);
    };

    const render = (type = 0) => {
        switch (type) {
        case 0:
        case 1:
            return (
                <CardSubtitle tag="div" className="mb-2 text-muted w-100">
                    <Button color="danger" id="verification" block>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        { ' ' }
                        { t('Verification') }
                    </Button>
                    <UncontrolledCollapse toggler="#verification">
                        <Card className="Verification text-center">
                            <CardBody>
                                <Form id="verification-form" onSubmit={doVerification}>
                                    <FormGroup>
                                        <Label for="passport">{t('Document type : Passport')}</Label>
                                        <Input type="file" name="passport" id="passport" onChange={fileSelectedHandler} />
                                        <FormText color="muted">
                                            { t('Please attach a scanned copy of your passport for user verification.') }
                                        </FormText>
                                    </FormGroup>
                                    { selectedFile && (<img src={_.get(selectedFile, 'Base64Data')} alt={_.get(selectedFile, 'FileName')} className="selected-img img-fluid" />) }
                                    <Button className="btn btn-success" disabled={!selectedFile}>{ t('Upload') }</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                </CardSubtitle>
            );
        case 2:
            return (
                <CardSubtitle tag="div" className="mb-2 text-muted w-100">
                    <Button color="secondary" className="btn-alert" id="verification" block>
                        <FontAwesomeIcon icon={faClock} />
                        { ' ' }
                        { t('Verification') }
                    </Button>
                    <UncontrolledCollapse toggler="#verification">
                        <Card className="Verification text-center">
                            <CardBody>
                                <p className="verification-text">{t('The previously uploaded document is being reviewed.')}</p>
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                </CardSubtitle>
            );
        case 3:
            return (
                <CardSubtitle tag="div" className="mb-2 text-muted w-100">
                    <Button color="success" id="verification" block>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        { ' ' }
                        { t('Verification') }
                    </Button>
                    <UncontrolledCollapse toggler="#verification">
                        <Card className="Verification text-center">
                            <CardBody>
                                <p className="verification-text">{t('Verification passed successfully')}</p>
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                </CardSubtitle>
            );
        default: return (<h2>Nothing found</h2>);
        }
    };

    return (
        <div className="Verification">
            {render(verification)}
        </div>
    );
}

Verification.propTypes = {
    verification: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    updateUserInfo: PropTypes.func.isRequired,
};
