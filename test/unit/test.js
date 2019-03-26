const {python} = require("../../");

module.exports = {
    async test(test) {
        test.expect(1);

        const x = {a:1, b: 2};
        const func = python`
            def exec(a):
                return a + ${x}["a"] + ${x}["b"]
        `;

        test.equals(typeof func, "function", "Returns a function")
        const data = await func(1);
        console.log(data);

        test.done();
    }
};
