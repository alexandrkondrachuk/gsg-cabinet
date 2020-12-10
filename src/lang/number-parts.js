import React from 'react';
import { FormattedNumberParts } from 'react-intl';

const partMinusSign = 'minusSign';
const partPlusSign = 'plusSign';
const partInteger = 'integer';
const partGroup = 'group';
const partDecimal = 'decimal';
const partFraction = 'fraction';

const numberParts = (value, currency = null, maximumFractionDigits = 2, groupSeparator = ' ', decimalSeparator = '.', minusSign = '', plusSign = '') => (
    <FormattedNumberParts value={value} useGrouping maximumFractionDigits={maximumFractionDigits} signDisplay="exceptZero">
        {
            (parts) => (
                <>
                    {(!!minusSign || !!plusSign) && (
                        <>
                            <span className="FormattedNumberParts_Sign">
                                {parts.map((part) => {
                                    switch (part.type) {
                                    case partMinusSign: return minusSign;
                                    case partPlusSign: return plusSign;
                                    default: return null;
                                    }
                                })}
                            </span>
                            &nbsp;
                        </>
                    )}
                    {!!currency && (
                        <>
                            <span className="FormattedNumberParts_Currency">{currency}</span>
                            &nbsp;
                        </>
                    )}
                    <span className="FormattedNumberParts_Number">
                        {parts.map((part) => (
                            <span key={(new Date()).toString()}>
                                {part.type === partInteger && part.value}
                                {part.type === partGroup && groupSeparator}
                                {part.type === partDecimal && decimalSeparator}
                                {part.type === partFraction && part.value}
                            </span>
                        ))}
                    </span>
                </>
            )
        }
    </FormattedNumberParts>
);

export default numberParts;
