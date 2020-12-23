import React, { useState } from 'react';
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
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { t } from '../../../../lang';

export default function Verification() {
    const [selectedFile, setSelectedFile] = useState(null);
    const doVerification = (e) => {
        // @todo implement file reading and send to the server
        // @todo add model for the form
        e.preventDefault();
        console.log('Do verification', selectedFile);
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
        console.log('file', file);
        const base64 = await convertBase64(file);
        setSelectedFile(base64);
    };

    return (
        <CardSubtitle tag="div" className="mb-2 text-muted w-100">
            <Button color="success" id="verification" block>
                <FontAwesomeIcon icon={faUserCheck} />
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
                            <Button className="btn btn-success">{ t('Upload') }</Button>
                        </Form>
                        { selectedFile && (<img src={selectedFile} alt="" className="img-fluid" />) }
                    </CardBody>
                </Card>
            </UncontrolledCollapse>
        </CardSubtitle>
    );
}
