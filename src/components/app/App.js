import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
    withRouter,
} from 'react-router-dom';
import {
    I18nPropvider, LOCALES, t,
} from '../../lang';
import { app as appActions } from '../../store/actions';

import './App.scss';

function App({ lang, dispatch }) {
    useEffect(() => {
        const language = document.querySelector('html').getAttribute('lang');
        const langFraction = _.get(language.split('-'), '[0]', 'ru');
        dispatch(appActions.changeLang(LOCALES[langFraction]));
    }, [dispatch]);
    return (
        <I18nPropvider locale={lang}>
            <div className="App">
                <h2 className="text-center">{t('Global Sun Group - Personal Cabinet')}</h2>
            </div>
        </I18nPropvider>
    );
}

const mapStateToProps = (state) => {
    const lang = _.get(state.app, 'lang');
    return { lang };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

App.defaultProps = {
    lang: LOCALES.en,
    dispatch: () => {},
};

App.propTypes = {
    lang: PropTypes.string,
    dispatch: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
