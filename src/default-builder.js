/*
 * Created by Henry Leu (henryleu@126.com) on 2018/1/12
 */
const Option = require('./option').Option;
const OptionAware = require('./option').OptionAware;
const DefaultDelegate = require('./default-delegate');
const DefaultAgent = require('./default-agent');

class Builder extends OptionAware {
    constructor (settings, metadata) {
        super();
        this.settings = settings;
        this.metadata = metadata;
        this._optionDelegate.add(Option.list('env', 'dev', ['dev', 'ci', 'prd']));
        this._optionDelegate.add(Option.list('appName', 'portal', ['portal', 'boss', 'open']));
        this._optionDelegate.add(Option.bool('debug', false));
        this._optionDelegate.add(Option.int('timeout', 5000, 1000, 60000));

        this._optionDelegate.setInPlace(true);
    }

    build () {
        const errors = this._optionDelegate.validate();
        if (errors.length > 0) throw new Error(errors.join('\n'));

        const options = this._optionDelegate.getOptions();
        const agent = new DefaultAgent(options);
        const delegate = new DefaultDelegate(this.settings, this.metadata);
        delegate.mixin(agent);

        return agent;
    }
}

module.exports = Builder;
