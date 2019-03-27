const {python} = require("../../");

module.exports = {
    async test(test) {
        test.expect(2);

        const x = {a:1, b: 2};
        const func = python`
            def exec(a):
                return a + ${x}["a"] + ${x}["b"]
        `;

        test.equals(typeof func, "function", "Returns a function");
        test.equals(await func(1), 4, "Does execute the function");

        test.done();
    }
};
