const ERROR_STORE_SIZE = Symbol('error_size');

function createErrorsStore() {
    return {
        [ERROR_STORE_SIZE]: 0,
    };
}

export default class BaseModel {
    _errors = createErrorsStore();

    constructor() {
        Object.defineProperty(this, '_errors', { enumerable: false });
    }

    get errors() {
        return this.errors;
    }

    hasErrors() {
        return this.errors[ERROR_STORE_SIZE] > 0;
    }

    cleanErrors() {
        this.errors = createErrorsStore();
    }

    cleanError(attribute) {
        if (!this.errors[attribute]) {
            return false;
        }

        delete this.errors[attribute];
        this.errors[ERROR_STORE_SIZE] -= 1;
        return true;
    }

    getError(attribute) {
        if (this.errors[attribute]) {
            return this.errors[attribute];
        }

        return null;
    }

    hasError(attribute) {
        return !!this.errors[attribute];
    }

    /**
     * Список валидаторов.
     * Первый элемент - список аттрибутов для валидации
     * Вротой элемент - фун-я валидатор который возвращает false или текст ошибки
     * Пример: [
     *  ['name, surname', function(attribute, value) {
     *      // this as model
     *      if (value !== 'test') {
     *          return 'Name and surname must be equal "test"';
     *      }
     *  }]
     * ]
     * @returns {Array}
     */
    static getRules() {
        return [];
    }

    /**
     * @param attributes {string[]|null}
     * @returns {boolean}
     */
    validate(attributes = null) {
        if (!Array.isArray(this.getRules())) {
            throw new Error('Rules must be array!');
        }

        this.cleanErrors();

        const onlyAttributes = Array.isArray(attributes) ? attributes : null;

        this.getRules().forEach((rules) => {
            const handler = rules[1];
            if (!(handler instanceof Function)) {
                throw new Error('Rules handler must be function!');
            }

            rules[0].split(',').forEach((attribute) => {
                // eslint-disable-next-line no-param-reassign
                attribute = attribute.trim();

                if (onlyAttributes && onlyAttributes.indexOf(attribute) === -1) {
                    return;
                }

                const error = handler.call(this, attribute, this[attribute]);
                if (error) {
                    if (!this.errors[attribute]) {
                        this.errors[attribute] = [];
                    }

                    this.errors[attribute].push(error);
                    this.errors[ERROR_STORE_SIZE] += 1;
                }
            });
        });

        return this.errors[ERROR_STORE_SIZE] === 0;
    }

    /**
     * перенос данных из источника
     * если наполнять данные в конструкторе данного класса то
     * значения по умолчанию дочернего класса перезапишут текущие
     * @param data
     */
    copyFrom(data) {
        if (data === null || typeof data !== 'object') {
            return;
        }

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const name in data) {
            if (Object.prototype.hasOwnProperty.call(data, name)) {
                this[name] = data[name];
            }
        }

        // eslint-disable-next-line consistent-return
        return this;
    }

    /**
     * Обновление данных только если есть такой атрибут в источнике
     * @param data
     * @returns {*}
     */
    feed(data) {
        if (data === null || typeof data !== 'object') {
            return;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const name in this) {
            if (data[name] !== undefined) {
                this[name] = data[name];
            }
        }

        // eslint-disable-next-line consistent-return
        return this;
    }

    clone() {
        const newInstance = new this.constructor();
        newInstance.copyFrom(this);

        return newInstance;
    }

    /**
     * @returns {Array}
     */
    getAttributesToSave() {
        return Object.keys(this);
    }

    /**
     * @returns {Object}
     */
    toSave() {
        // eslint-disable-next-line no-new-object
        const objectToSave = new Object(null);
        this.getAttributesToSave().forEach((attribute) => {
            objectToSave[attribute] = this[attribute];
        });

        return objectToSave;
    }
}
