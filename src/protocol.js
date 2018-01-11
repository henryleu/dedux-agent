/*
 * created by henryleu (henryleu@126.com) on 15/09/2017 09 2017
 */

const isInBrowser = () => typeof window !== 'undefined';

const isInNode = () => typeof window === 'undefined' && typeof global !== 'undefined';

const isInSecuredPage = () => typeof location !== 'undefined' && location.protocol === 'https:';

const isSecured = () => !isInNode() && isInSecuredPage();

const getProtocol = () => isSecured() ? 'https:' : 'http:';

module.exports = {isInBrowser, isInNode, isInSecuredPage, isSecured, getProtocol};
