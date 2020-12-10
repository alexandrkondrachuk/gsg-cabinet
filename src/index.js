import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import App from './components/app';
import store, { history } from './store/store';

import './assets/scss/index.scss';

if (document.getElementById('cabinet')) {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>,
        document.getElementById('cabinet'),
    );
}
