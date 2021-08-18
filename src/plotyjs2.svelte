<script>
    import { onMount } from "svelte";
    // L_value: size of the axis
    let L_value = 15;
    // factor: how many points per 1 unit distance
    let factor = 4;
    let n_value = 1;
    let l_value = 0;
    let m_value = 0;
    // minimum_percent: minimum PDF to render in
    let minimum_percent = 0.00001;
    // you'll need to change the L_value accordingly when changing the value below
    let bohr_radius_value = 0.529177;

    console.log("n = " + n_value);
    console.log("l = " + l_value);
    console.log("m = " + m_value);
    console.log("minimum percent = " + minimum_percent);
    console.log("bohr radius = " + bohr_radius_value);

    // the (assodiated) Laguerre polynomial
    const laguerrePolynomial = (n, k, x) => {
        const equation = (m) => {
            return (
                (factorialize(n + k) /
                    (factorialize(n - m) *
                        factorialize(k + m) *
                        factorialize(m))) *
                x ** m *
                (-1) ** m
            );
        };
        return sigma(equation, 0, n);
    };

    // sigma
    const sigma = (equation, i, n) => {
        let sum = 0;
        while (i <= n) {
            sum += equation(i);
            i++;
        }
        return sum;
    };

    // factorialize input
    const factorialize = (x) => {
        if (x < 0) {
            return -1;
        } else if (x === 0) {
            return 1;
        } else {
            return x * factorialize(x - 1);
        }
    };

    // the spherical harmonics
    const sphericalHarmonics = (l, m, theta, phi) => {
        if (m > 0) {
            return (
                Math.sqrt(
                    ((2 * l + 1) * factorialize(l - m)) /
                        (4 * Math.PI * factorialize(l + m))
                ) *
                legendrePolynomial(l, m, Math.cos(theta)) *
                Math.sin(m * phi)
            );
        } else {
            return (
                Math.sqrt(
                    ((2 * l + 1) * factorialize(l - m)) /
                        (4 * Math.PI * factorialize(l + m))
                ) *
                legendrePolynomial(l, m, Math.cos(theta)) *
                Math.cos(m * phi)
            );
        }
    };

    //the Legendre polynomials
    const legendrePolynomial = (l, m, x) => {
        const equation = (x) => {
            return (x ** 2 - 1) ** l;
        };
        return (
            ((-1) ** m / (2 ** l * factorialize(l))) *
            (1 - x ** 2) ** (m / 2) *
            highOrderDerivative(equation, l + m, x)
        );
    };
    // nth deriviation
    const highOrderDerivative = (equation, order, x) => {
        let i = 1;
        let deriviation = equation;
        while (i < order) {
            deriviation = derivative(deriviation);
            i++;
        }
        if (order === 0) {
            return 1;
        } else {
            return derivative(deriviation)(x);
        }
    };

    // deriviation
    const derivative = (f) => {
        var h = 0.001;
        return function (x) {
            return (f(x + h) - f(x - h)) / (2 * h);
        };
    };

    //3. finally, a function that gives us the wave function
    const waveFunction = (n, l, m, r, theta, phi) => {
        const rho = (2 * r) / (n * bohrRadius());
        return (
            Math.sqrt(
                ((2 / (n * bohrRadius())) ** 3 * factorialize(n - l - 1)) /
                    (r * 2 * n * factorialize(n + l))
            ) *
            Math.E ** (rho / -2) *
            rho ** l *
            laguerrePolynomial(n - l - 1, 2 * l + 1, rho) *
            sphericalHarmonics(l, m, theta, phi)
        );
    };

    // the bohr radius, represented by a0
    const bohrRadius = () => {
        //return 1;
        return bohr_radius_value;
    };

    const radius = (x, y, z) => {
        return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    };

    const theta = (x, y, z) => {
        return Math.acos(z / radius(x, y, z));
    };

    const phi = (y, x) => {
        return Math.atan(y / x);
    };

    // creates points from [-L,-L,-L] to [L,L,L]
    const getTrace = () => {
        let data = {
            x: [],
            y: [],
            z: [],
        };
        let maximum = 0;
        let minimum = 1;
        let i = -1 * L_value * factor;
        while (i < L_value * factor) {
            let t = -1 * L_value * factor;
            while (t < L_value * factor) {
                let s = -1 * L_value * factor;
                while (s < L_value * factor) {
                    let percent =
                        waveFunction(
                            n_value,
                            l_value,
                            m_value,
                            radius(i / factor, t / factor, s / factor),
                            theta(i / factor, t / factor, s / factor),
                            phi(t / factor, i / factor)
                        ) ** 2;
                    if (percent > minimum_percent) {
                        data.x.push(i / factor);
                        data.y.push(t / factor);
                        data.z.push(s / factor);
                    }
                    if (percent > maximum) {
                        maximum = percent;
                    }
                    if (percent < minimum && percent !== 0) {
                        minimum = percent;
                    }
                    s += 1;
                }
                t += 1;
            }
            i += 1;
        }
        console.log("plot counts = " + data.x.length);
        console.log("maximum = " + maximum);
        console.log("minimum = " + minimum);
        return data;
    };

    let graphDiv;

    const newTrace = () => {
        let object_data = getTrace();
        let x_data = object_data.x;
        let y_data = object_data.y;
        let z_data = object_data.z;
        return {
            x: x_data,
            y: y_data,
            z: z_data,
            mode: "markers",
            marker: {
                color: "rgb(66, 135, 245)",
                size: 1,
                symbol: "circle",
                opacity: 0.6,
            },
            type: "scatter3d",
        };
    };

    onMount(() => {
        var layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
            },
        };
        Plotly.newPlot(graphDiv, [newTrace()], layout);
    });
</script>

<div bind:this={graphDiv} class="w-screen h-screen" />
