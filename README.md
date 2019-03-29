# scramjet-python-module

A [scramjet][1] module that allows piping any stream via python pipeline.

See [test.js line 8](https://github.com/MichalCz/scramjet-python-module/blob/master/test/unit/test.js#L8) - here's what we're trying to do.

The objective is to be able to run:

```javascript
stream.use(
    python` < some python transforms > `
)
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
$ node test/benchmark/call.js
Cold latency: 145.955 ms
Throughput: 1691 exec/s
Hot latency: 550.957 µs
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
