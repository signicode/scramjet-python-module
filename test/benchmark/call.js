const assert = require("assert");
const {python} = require("../../");
const {DataStream} = require("scramjet");
const elapsed = ([os, ons], [s, ns] = process.hrtime()) => {
    return (s - os) * 1e9 + (ns - ons);
};

const selapsed = (ot, t = process.hrtime()) => {
    const nanos = elapsed(ot, t);

    if (nanos < 1e3) return `${Math.round(nanos)} ns`;
    if (nanos < 1e6) return `${Math.round(nanos) / 1e3} µs`;
    if (nanos < 1e9) return `${Math.round(nanos / 1e3) / 1e3} ms`;
    return `${Math.round(nanos / 1e6) / 1e3} s`;
};

(async () => {

    const x = {a:1, b: 2};
    const func = python`
        def exec(a):
            return a + ${x}["a"] + ${x}["b"]
    `;

    const ts1 = process.hrtime();
    assert.strictEqual(await func(1), 4);
    const ts2 = process.hrtime();

    const ts3 = process.hrtime();

    await DataStream
        .from(function*() {
            let i = 0; while (i++ < 999) yield i;
        })
        .map(func)
        .toArray();

    const ts4 = process.hrtime();

    const ts5 = process.hrtime();
    assert.strictEqual(await func(2), 5);
    const ts6 = process.hrtime();

    console.log("Cold latency:", selapsed(ts1, ts2));
    console.log("Throughput:", Math.round(1e12 / elapsed(ts3, ts4)), "exec/s");
    console.log("Hot latency:", selapsed(ts5, ts6));

    await func.end();

})()
    .catch(
        (e) => {
            console.error(e.stack);
            process.exit(1);
        }
    )
;
