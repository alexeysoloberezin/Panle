export const getErrorMessage = (error) => {
    return error?.response?.data?.message || error.message;
}

export const clearForm = (form, initialForm, v$) => {
    for (const key in initialForm) {
        form[key] = initialForm[key];
    }
    v$?.value?.$reset();
}

const multiplePreventFunction = new Map();
// export const preventMultipleUse = async (preventFunction, cb) => {
//     if (!multiplePreventFunction.get(preventFunction)) {
//         multiplePreventFunction.set(preventFunction, true);
//         await cb();
//         multiplePreventFunction.set(preventFunction, false);
//     }
// }
export const preventMultipleUse = async (preventFunction, cb) => {
    let promise = multiplePreventFunction.get(preventFunction);
    if (promise) {
        return promise
    }
    promise = new Promise(async (resolve) => {
        await cb();
        multiplePreventFunction.set(preventFunction, false);
        resolve();
    })
    multiplePreventFunction.set(preventFunction, promise);
    return promise
}
