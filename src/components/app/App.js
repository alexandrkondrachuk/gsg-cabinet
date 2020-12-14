import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
    TabContent, TabPane, Nav, NavItem, NavLink, Alert,
} from 'reactstrap';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faIdCard, faMoneyCheck, faDollarSign, faHistory, faBusinessTime,
} from '@fortawesome/free-solid-svg-icons';
import { config } from '../../config';
import Types from '../../classes/Types';
import TabsRenderer from '../tabs-renderer/TabsRenderer';
import {
    I18nPropvider, LOCALES, t,
} from '../../lang';
import AuthModel from '../../models/auth-model';
import AuthInfoModel from '../../models/auth-info-model';
import UserInfoModel from '../../models/user-info-model';
import { app as appActions } from '../../store/actions';
import alertSVG from '../../assets/images/icons/alert-repo.svg';
import Transport from '../../classes/Transport';

import './App.scss';

const urls = config.get('urls');
const main = _.get(urls, 'main');
const timers = config.get('timers');

const icons = {
    faIdCard,
    faMoneyCheck,
    faDollarSign,
    faHistory,
    faBusinessTime,
};

function App({
    lang, auth, authInfo, dispatch,
}) {
    const redirect = (target = '/') => {
        window.location.replace(target);
    };
    // Get language
    useEffect(() => {
        const language = document.querySelector('html').getAttribute('lang');
        const langFraction = _.get(language.split('-'), '[0]', 'ru');
        const redirectURL = _.get(main, langFraction);
        const redirectDelay = _.get(timers, 'redirectAfterAuth');

        dispatch(appActions.changeLang(LOCALES[langFraction]));
        _.delay(() => {
            if (!auth || !auth.isReady) {
                redirect(redirectURL);
            }
        }, redirectDelay);
    }, [dispatch, auth]);

    useEffect(async () => {
        try {
            const userModel = await Transport.getUserData(authInfo);
            dispatch(appActions.getUserInfo(new UserInfoModel(userModel)));
        } catch (e) {
            throw new Error(e);
        }
    }, [dispatch, authInfo]);

    useEffect(async () => {
        try {
            const stations = await Transport.getStations();
            dispatch(appActions.getStations(stations));
        } catch (e) {
            throw new Error(e);
        }
    }, [dispatch]);

    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
        <I18nPropvider locale={lang}>
            <div className="App container">
                {(auth && auth.isReady) ? (
                    <>
                        <Nav tabs className="App__Tabs">
                            {Types.tabs.map((tab) => (
                                <NavItem key={tab.id.toString()}>
                                    <NavLink
                                        className={classnames({ active: activeTab === tab.id.toString() })}
                                        onClick={() => {
                                            toggle(tab.id.toString());
                                        }}
                                    >
                                        <FontAwesomeIcon icon={icons[tab.icon]} />
                                        {' '}
                                        {t(tab.name)}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <TabContent className="App__TabContent" activeTab={activeTab}>
                            {Types.tabs.map((tab) => (
                                <TabPane key={tab.id.toString()} tabId={tab.id.toString()}>
                                    <TabsRenderer tag={tab.tagName} />
                                </TabPane>
                            ))}
                        </TabContent>
                    </>
                ) : (
                    <Alert className="Alert" color="danger">
                        <div className="Alert__SVG">
                            <ReactSVG src={alertSVG} />
                        </div>
                        <p className="Alert__Text">
                            {t('There is an issue in login process. You will be redirected to the main page. Sorry for the inconvenience.')}
                        </p>
                    </Alert>
                )}
            </div>
        </I18nPropvider>
    );
}

const mapStateToProps = (state) => {
    const lang = _.get(state.app, 'lang');
    const auth = _.get(state.app, 'auth');
    const authInfo = _.get(state.app, 'authInfo');
    return { lang, auth, authInfo };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

App.defaultProps = {
    lang: LOCALES.en,
    dispatch: () => {
    },
};

App.propTypes = {
    lang: PropTypes.string,
    dispatch: PropTypes.func,
    auth: PropTypes.instanceOf(AuthModel).isRequired,
    authInfo: PropTypes.instanceOf(AuthInfoModel).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
