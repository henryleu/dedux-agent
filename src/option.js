/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/12
 */

class Option {
    constructor (config) {
        if (typeof config !== 'object') throw new Error('config needs to be object');

        if (typeof config.name !== 'string' || !config.name) {
            throw new Error('config name is required');
        }
        this.name = config.name;

        this.hasDefault = !!config.hasDefault;

        typeof config.defaultValue !== 'undefined' && (this.defaultValue = config.defaultValue);

        if (config.validate && typeof config.validate !== 'function') {
            throw new Error('config validate should be a function');
        }
        config.validate && (this.validate = config.validate);
    }

    validate (v) { return ''; }

    static int (name, defaultValue, from, to) {
        if (!Number.isInteger(defaultValue)) throw new Error(`defaultValue ${defaultValue} should be an integer`);
        if (!Number.isInteger(from)) throw new Error(`from ${from} should be an integer`);
        if (!Number.isInteger(to)) throw new Error(`to ${to} should be an integer`);
        if (from >= to) throw new Error(`from ${from} should be less than to ${to}`);
        if (defaultValue < from || defaultValue > to) throw new Error(`defaultValue ${defaultValue} should be between ${from} and ${to}`);

        const validate = (v) => {
            const error = `${name} ${v} should be an integer between ${from} and ${to}`;
            if (!Number.isInteger(v) || v < from || v > to) return error;
            return '';
        }
        return new Option({
            name,
            hasDefault: true,
            defaultValue,
            validate
        });
    }

    static bool (name, defaultValue) {
        defaultValue = !!defaultValue;
        return new Option({
            name,
            hasDefault: true,
            defaultValue
        });
    }

    static list (name, defaultValue, enumList) {
        if (!Array.isArray(enumList)) throw new Error(`enumList ${enumList.join(', ')} should be an array`);
        if (!enumList.includes(defaultValue)) throw new Error(`defaultValue ${defaultValue} should be in ${enumList.join(', ')}`);
        const validate = (v) => enumList.includes(v) ? '' : `${name} ${v} should be in ${enumList.join(', ')}`;
        return new Option({
            name,
            hasDefault: true,
            defaultValue,
            validate
        });
    }
}

class OptionDelegate {
    constructor () {
        this.inPlace = false; // by default, do not validate option setting in place
        this.fieldList = [];
        this.fieldMap = {};
        this.options = {};
    }

    setInPlace (validateInPlace) {
        this.inPlace = !!validateInPlace;
    }

    getOptions () { return this.options; }

    add (field) {
        if (!(field instanceof Option)) {
            throw new Error('option needs to be the instance of Option');
        }

        if (this.fieldMap[field.name]) {
            throw new Error(`option field ${field.name} exists`);
        }

        this.fieldList.push(field);
        this.fieldMap[field.name] = field;

        if (field.hasDefault) {
            this.options[field.name] = field.defaultValue;
        }
    }

    validate () {
        let ret = [];
        for (let field of this.fieldList) {
            let result = typeof field.valid === 'function' && field.valid(this.options[field.name]);
            if (result) ret.push(result);
        }
        return ret;
    }

    set (name, value) {
        if (typeof name === 'string' && typeof value !== 'undefined') {
            const field = this.fieldMap[name];
            if (!field) {
                console.error(`doesn't support the option ${name}`);
                return this;
            }

            if (this.inPlace && typeof field.valid === 'function') {
                let result = field.valid(this.options[name]);
                if (result) {
                    console.error(result);
                    // TODO queue the error msg
                } else {
                    this.options[name] = value;
                }
            } else {
                this.options[name] = value;
            }
            return this;
        } else if (typeof name === 'object' && typeof value === 'undefined') {
            const config = name;
            for (let n in config) {
                if (config.hasOwnProperty(n)) {
                    this.set(n, config[n]);
                }
            }
            return this;
        } else {
            console.error('option setting with invalid parameters');
            return this;
        }
    }
}

class OptionAware {
    constructor () {
        this._optionDelegate = new OptionDelegate();
    }

    set (...args) {
        this._optionDelegate.set(...args);
        return this;
    }
}

module.exports = { Option, OptionDelegate, OptionAware };
