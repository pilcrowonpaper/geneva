const bohr_radius_value = 0.529177;

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
    return (
        Math.sqrt(
            ((2 * l + 1) / 4 * Math.PI) *
            (factorialize(l - m) / factorialize(l + m))
        ) *
        legendrePolynomial(l, m, Math.cos(theta))
        //* Math.sqrt(Math.cos(m * phi))
    );
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
export const waveFunction = (n, l, m, r, theta, phi) => {
    const rho = (2 * r) / (n * bohrRadius());
    return (
        Math.sqrt(
            ((2 / (n * bohrRadius())) ** 3) *
            (factorialize(n - l - 1)) / (2 * n * factorialize(n + l))
        ) *
        Math.E ** (rho / 2 * -1) *
        rho ** l *
        laguerrePolynomial(n - l - 1, 2 * l + 1, rho) *
        sphericalHarmonics(l, m, theta, phi)
    );
};

// the bohr radius, represented by a0
const bohrRadius = () => {
    return bohr_radius_value;
};

export const radius = (x, y, z) => {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const theta = (x, y, z) => {
    return Math.acos(z / radius(x, y, z));
};

export const phi = (y, x) => {
    return Math.atan(y / x);
};