const assert = require("assert");
const {python} = require("../../");
const {DataStream} = require("scramjet");

let currmark = [0, 0];
const mark = () => currmark = process.hrtime();
const elapsed = ([os, ons] = currmark, [s, ns] = process.hrtime()) => {
    return (s - os) * 1e9 + (ns - ons);
};

const showTime = (nanos) => {
    if (nanos < 1e3) return `${Math.round(nanos)} ns`;
    if (nanos < 1e6) return `${Math.round(nanos) / 1e3} µs`;
    if (nanos < 1e9) return `${Math.round(nanos / 1e3) / 1e3} ms`;
    return `${Math.round(nanos / 1e6) / 1e3} s`;
};

const selapsed = (ot = currmark, t = process.hrtime()) => showTime(elapsed(ot, t));

(async () => {

    const x = {a:1, b: 2};

    mark();
    const func = python`
        exec = lambda a: a + ${x}["a"] + ${x}["b"]
    `;
    assert.strictEqual(await func(1), 4);
    console.log("Compile time latency:", selapsed());

    mark();
    await DataStream
        .from(function*() {
            let i = 0; while (i++ < 999) yield i;
        })
        .setOptions({maxParallel: 128})
        .map(func)
        .toArray();

    console.log("Throughput:", Math.round(1e12 / elapsed()), "exec/s");

    mark();
    assert.strictEqual(await func(2), 5);
    console.log("Hot latency:", selapsed());

    await func.end();

})()
    .catch(
        (e) => {
            console.error(e.stack);
            process.exit(1);
        }
    )
;
