import Url from 'url';
import urlUtils from '../utils/url-utils';
import serialize from 'form-serialize';

const getParams = (source) => {
    // If the source is a URL, parse it
    if (source instanceof URL && source.search) {
        return urlUtils.parseQueryParams(decodeURI(source.search).split('&'));
    }

    // If the source is a form element, serialize it
    if (source instanceof HTMLFormElement) {
        return urlUtils.parseQueryParams(decodeURI(serialize(source)).split('&'));
    }

    // If the source is a string, parse it
    if (typeof source === 'string') {
        return urlUtils.parseQueryParams(decodeURI(source).split('&'));
    }

    // If the source is an object, return it as is
    if (typeof source === 'object') {
        return source;
    }

    return {};
}

/**
 * Merge query string parameters to a URL
 * @param {*} sourceUrl 
 * @param {*} mergeParams 
 * @returns 
 */
const mergeQs = (sourceUrl, mergeParams) => {
    const url = Url.parse(sourceUrl, true);

    const formQueryParams = getParams(mergeParams);

    for (const key in formQueryParams) {
        if (formQueryParams.hasOwnProperty(key)) {
            url.query[key] = formQueryParams[key];
        }
    }

    const urlQueryParams = {};
    Object.assign(urlQueryParams, url.query);

    return Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(urlQueryParams) });
}

export default mergeQs;