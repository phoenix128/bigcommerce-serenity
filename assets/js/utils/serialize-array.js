import serialize from 'form-serialize';

function serializeArray(form) {
    const serializedObject = serialize(form, { hash: true });

    function flattenObject(obj, prefix = '') {
        return Object.keys(obj).reduce((acc, key) => {
            const pre = prefix.length ? prefix + '[' + key + ']' : key;

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                return acc.concat(flattenObject(obj[key], pre));
            } else {
                acc.push({ name: pre, value: obj[key] });
                return acc;
            }
        }, []);
    }

    return flattenObject(serializedObject);
}

export default serializeArray;
