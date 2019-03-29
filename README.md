# scramjet-python-module

A [scramjet][1] module that allows piping any stream via python pipeline.

See [test.js line 8](https://github.com/MichalCz/scramjet-python-module/blob/master/test/unit/test.js#L8) - here's what we're trying to do.

The objective is to be able to run:

```javascript
stream.use(
    python` < some python transforms > `
)
```

Currently we can:

```javascript
stream.map(
    python`exec = lambda a: a + 1`
);
```

## Tests

The current outcome is:

```
✔ /c/src/scramjet5/scramjet-python-module [master|✔]
00:46 $ nodeunit test/unit/test.js

test.js
4
√ test

OK: 1 assertions (117ms)
```

## Benchmark

Intel i7-8750H, 32GB RAM:

```
/scramjet/scramjet-python-module [master|✔]
23:58 $ node test/benchmark/call.js
Compile time latency: 67.754 ms
Throughput: 5494 exec/s
Hot latency: 167.42 µs
✔
```

## TODO's

* Currently we can `map` but we want to `use` `python`
  * Create a TCP server on python side
  * Recreate methods for scramjet
  * Implement protocol from stream-child.js
* Create a repo and describe the protocol
* Describe the PromiseTransformStream class

[1]: https://www.scramjet.org/
