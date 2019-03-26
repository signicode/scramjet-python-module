const fini = require("infinite-sequence-generator");
const {serializePython, pythonBridge} = require("python-bridge");

const getPythonCode = (code, ...vars) => {
    const seq = fini("_", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const indentToNormalize = "\n" +
        code
            .join("")
            .split("\n")
            .filter(x => x)
            .reduce(
                (indent, line) => {
                    const thisLineIndent = line.match(/^\s+/);
                    if (thisLineIndent && thisLineIndent.length < indent.length)
                        return thisLineIndent;

                    return indent;
                },
                {length: Infinity}
            );

    const varList = vars.reduce((acc, v) => {
        if (!acc.includes(v))
            acc.push(v);

        return acc;
    }, [])
    const varNames = varList.map(x => seq.next().value);

    const variables = varNames.map((name, i) => {
        return `${name} = ${serializePython(varList[i])}`;
    });

    return Array.from(function*() {
        yield* variables;
        yield "\n";

        const varStack = vars.map(v => varNames[varList.indexOf(v)]);

        for (let slice of code) {
            yield slice.replace(new RegExp(indentToNormalize, "g"), "\n");
            if (varStack.length > 0) yield varStack.shift()
        }
    }()).join("");
}

const executePython = (bridge, script, ...vars) => {
    return bridge(script, ...vars)
};

const python = (code, ...vars) => {
    if (Array.isArray(code)) {
        const bridge = pythonBridge();
        const script = getPythonCode(code, ...vars);

        const ready = bridge.ex([script]);
        return (...args) => ready
            .then(
                () => bridge(
                    ["exec(", ...args.slice(1).map(() => ","), ")"],
                    ...args
                )
            );
    } else {
        const bridge = pythonBridge(code);
        return (code, ...vars) => {
            if (!Array.isArray(code)) throw new Error("Cannot pass options twice! Yet anyway...");

            const script = getPythonCode(code, ...vars);
            const ready = bridge.ex([script]);

            const argv = args.slice(1).map(() => ",");
            console.log(argv);

            return (...args) => ready
                .then(
                    () => bridge(
                        ["exec(", ...argv, ")"],
                        ...args
                    )
                );
        };
    }
}

module.exports = {
    python
};