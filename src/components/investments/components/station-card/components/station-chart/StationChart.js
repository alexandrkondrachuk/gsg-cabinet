import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import numeral from 'numeral';
import Chart from 'chart.js';
import moment from 'moment';
import * as _ from 'lodash';
import { config } from '../../../../../../config';

import './StationChart.scss';

const numberFormat = config.get('numberFormat');

Chart.defaults.global.defaultFontColor = '#323b56';
Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontFamily = 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// eslint-disable-next-line react/prefer-stateless-function
export default class StationChart extends Component {
    static BAR_AMOUNT = 12;

    static TRANSLATE = {
        'ru-ru': {
            Profit: 'Прибыль',
            'Investment Payout': 'Инвестиционная выплата',
            'Payout date': 'Дата выплаты',
            'Payout investments': 'Выплата инвестиций',
            Total: 'Всего',
            k: 'тыс.',
        },
        'en-us': {
            Profit: 'Profit',
            'Investment Payout': 'Investment Payout',
            'Payout date': 'Payout date',
            'Payout investments': 'Payout investments',
            Total: 'Total',
            k: 'k',
        },
    };

    static t(lang, id) {
        return _.get(StationChart.TRANSLATE, `${lang}.${id}`, '');
    }

    static generateDataSet(model) {
        const paymentAmount = _.get(model, 'PaymentAmount', 0);
        const investAmount = _.get(model, 'Amount', 0);
        const labels = [];
        const dataPayout = [];
        const dataProfit = [];
        const amountP = paymentAmount.toString().replace(/ /g, '');

        for (let i = 1; i <= StationChart.BAR_AMOUNT; i += 1) {
            let payout = (+amountP * i);
            let profit = 0;
            payout = (payout >= investAmount) ? (+investAmount) : payout;
            profit = ((+amountP * i) - investAmount);
            profit = (profit <= 0) ? 0 : profit;
            labels.push(moment().add(i, 'M').format('MM.YY'));
            dataPayout.push(payout.toFixed(2));
            dataProfit.push(profit.toFixed(2));
        }
        return {
            labels,
            dataPayout,
            dataProfit,
        };
    }

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidMount() {
        const { model, lang } = this.props;
        this.initChart(model, lang);
    }

    componentDidUpdate(prevProps) {
        const { model, lang } = this.props;
        if (JSON.stringify(prevProps.model) !== JSON.stringify(model)) {
            this.updateChart(model, lang);
        }
    }

    initChart(model, lang) {
        const ctx = this.chartRef.current.getContext('2d');
        const { labels, dataPayout, dataProfit } = StationChart.generateDataSet(model, lang);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: StationChart.t(lang, 'Investment Payout'),
                    data: dataPayout,
                    backgroundColor: 'rgba(0, 167, 118, 0.75)',
                    borderColor: '#00a776',
                    borderWidth: 1,
                },
                {
                    label: StationChart.t(lang, 'Profit'),
                    data: dataProfit,
                    backgroundColor: 'rgba(23, 162, 184, 0.75)',
                    borderColor: '#17a2b8',
                    borderWidth: 1,
                }],
            },
            options: {
                tooltips: {
                    callbacks: {
                        title(tooltipItem, data) {
                            return `${StationChart.t(lang, 'Payout date')}: ${data.labels[tooltipItem[0].index]}`;
                        },
                        label(tooltipItem, data) {
                            if (tooltipItem.datasetIndex === 0) {
                                // eslint-disable-next-line max-len
                                return `${StationChart.t(lang, 'Payout investments')}: ${numeral(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).format(numberFormat).replace(',', ' ')} $`;
                            }
                            // eslint-disable-next-line max-len
                            return `${StationChart.t(lang, 'Profit')}: ${numeral(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).format(numberFormat).replace(',', ' ')} $`;
                        },
                        afterLabel(tooltipItem, data) {
                            const total = +(data.datasets[0].data[tooltipItem.index]) + +(data.datasets[1].data[tooltipItem.index]);
                            // eslint-disable-next-line quotes
                            return (`${StationChart.t(lang, 'Total')}: ${numeral(total).format(numberFormat).replace(',', ' ')} $`);
                        },
                    },
                    displayColors: true,
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {
                            display: false,
                        },
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            callback: (label) =>
                                // eslint-disable-next-line implicit-arrow-linebreak
                                (`${numeral(label).format(numberFormat).replace(',', ' ')} $`)
                            ,
                        },
                        type: 'linear',
                    }],
                },
                responsive: true,
                maintainAspectRatio: true,
                legend: { position: 'bottom' },
            },
        });
    }

    updateChart(model) {
        const { labels, dataPayout, dataProfit } = StationChart.generateDataSet(model);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = dataPayout;
        this.chart.data.datasets[1].data = dataProfit;
        this.chart.update();
    }

    render() {
        return (
            <div className="StationChart">
                <div className="StationChart__Container">
                    <canvas id="payoutChart" ref={this.chartRef} />
                </div>
            </div>
        );
    }
}

StationChart.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    model: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
};
