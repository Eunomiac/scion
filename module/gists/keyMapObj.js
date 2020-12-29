export const mapObj = (obj, ...funcs) => {
    /**
     * Array.map() for objects, with the ability to map both keys and values.
     *   
     *  If one function is passed, it's assumed to be a value-mapping function (leaving the keys unchanged).
     *  Otherwise, the first function maps the keys, and the second maps the values.
     *  
     *  Both functions accept both the key and the value, allowing the mapping to depend on either or both:
     * 
     *  Key Mapping Function:    (key, value) => resultKey
     *  Value Mapping Function:  (value, key) => resultValue 
     */

    let [valFunc, keyFunc] = funcs.reverse().filter((x) => typeof x === "function");
    keyFunc = keyFunc ?? function(key) {return key};
    const newObj = {};
    Object.entries(obj).forEach(([key, val]) => {
        newObj[keyFunc(key, val)] = valFunc(val, key);
    });
    return newObj;
};