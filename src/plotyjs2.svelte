js<script>
    import { onMount } from "svelte";
    let nx_value = 20;
    let ny_value = 20;
    let nz_value = 20;
    let L_value = 4;
    let V_value = L_value ** 3;

    //1. create a function that solves the (assodiated) Laguerre polynomial
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

    //1-1. a function that does sigma
    const sigma = (equation, i, n) => {
        let sum = 0;
        while (i <= n) {
            sum += equation(i);
            i++;
        }
        return sum;
    };

    //1-1a. a function that factorialize input
    const factorialize = (x) => {
        if (x < 0) {
            return -1;
        } else if (x === 0) {
            return 1;
        } else {
            return x * factorialize(x - 1);
        }
    };

    //2. a function that solces the spherical harmonics
    const sphericalHarmonics = (l, m, theta, phi) => {
        return (
            Math.sqrt(
                ((2 * l + 1) * factorialize(l - m)) /
                    (4 * Math.PI * factorialize(l + m))
            ) *
            legendrePolynomial(l, m, Math.cos(theta)) *
            Math.E ** (m * phi)
        );
    };

    //2.1 create a function that solves the Legendre polynomials
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
    //2.1 a function that does nth deriviation
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

    //2.1a a function that does deriviation
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

    //3.1 the bohr radius, represented by a0
    const bohrRadius = () => {
        return 1;
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

    //2. make function that sets opacity from value
    function Trace(x, y, z) {
        let percent = (waveFunction(
                        2,
                        1,
                        0,
                        radius(x, y, z),
                        theta(x, y, z),
                        phi(y, x)
                    ) ** 2) / 0.0036
        this.x = [x];
        this.y = [y];
        this.z = [z];
        this.mode = "markers";
        this.marker = {
            color: "rgb(66, 135, 245)",
            size: 5,
            symbol: "circle",
            opacity: percent,
        };
        this.type = "scatter3d";
        this.showlegend = false;
    }

    //1. make function that creates points from [0,0,0] to [1,1,1]
    const getTrace = () => {
        let data = [];
        let i = -20;
        while (i < L_value * 5) {
            let t = -20;
            while (t < L_value * 5) {
                let s = -20;
                while (s < L_value * 5) {
                    let percent = waveFunction(
                        2,
                        1,
                        0,
                        radius(i / 5, t / 5, s / 5),
                        theta(i / 5, t / 5, s / 5),
                        phi(t / 5, i / 5)
                    ) ** 2;
                    //"improve" speed by only finding ones with probability over 0.01
                    if (percent > 0.0005) {
                        data.push(new Trace(i / 5, t / 5, s / 5));
                    }
                    s += 1;
                }
                t += 1;
            }
            i += 1;
        }
        return data;
    };

    let graphDiv;

    onMount(() => {
        var layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
            },
        };
        Plotly.newPlot(graphDiv, getTrace(), layout);
    });
</script>

<div bind:this={graphDiv} class="w-screen h-screen" />

