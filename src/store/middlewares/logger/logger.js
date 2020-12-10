export default function logger({ getState }) {
    return (next) => (action) => {
        console.log('will dispatch', action);
        console.log('state before dispatch', getState());
        const returnValue = next(action);
        console.log('state after dispatch', getState());
        return returnValue;
    };
}
