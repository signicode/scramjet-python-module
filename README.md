# scramjet-python-module

A [scramjet][1] module that allows piping any stream via python pipeline.

See [test.js line 8](https://github.com/MichalCz/scramjet-python-module/blob/master/test/unit/test.js#L8) - here's what we're trying to do.

The objective is to be able to run:

```javascript
stream.use(
    python` < some python transforms > `
)
```

The current outcome is:

```
✔ /c/src/scramjet5/scramjet-python-module [master|✔]
00:46 $ nodeunit test/unit/test.js

test.js
4
√ test

OK: 1 assertions (117ms)
```

[1]: https://www.scramjet.org/
