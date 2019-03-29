const {python} = require("../../");

module.exports = {
    async test(test) {
        test.expect(3);

        const x = {a:1, b: 2};
        const func = python`
            def exec(a):
                x = ${x};
                return a["c"] + x["a"] + x["b"] + 1
        `;

        test.equals(typeof func, "function", "Returns a function");
        test.equals(await func({c:0}), 4, "Does execute the function");
        test.equals(await func({c:1}), 5, "Does do the calculation in python!");

        test.done();
    }
};
