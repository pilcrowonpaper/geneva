<script>
    import { onMount } from "svelte";
    let nx_value = 3;
    let ny_value = 3;
    let nz_value = 3;
    let L_value = 1;
    let V_value = L_value ** 3;

    const getRGB = (num) => {
        let totalVal = num * 255 * 3;
        let r = 255;
        let g = 0;
        let b = 0;
        if (totalVal >= 255) {
            g = 255;
        } else {
            g = totalVal % 255;
        }
        if (totalVal >= 255 * 2) {
            r = 0;
        } else if (totalVal > 255) {
            r = 255 - (totalVal % 255);
        }
        if (totalVal >= 255 * 3) {
            b = 255;
        } else if (totalVal > 255 * 2) {
            b = totalVal % 255;
        }
        return `rgb(${r}, ${g}, ${b})`;
    };

    const calculate_wave_function = (x, y, z) => {
        return Math.sqrt(8 / V_value) * Math.sin((nx_value * Math.PI * x) / L_value) * Math.sin((ny_value * Math.PI * y) / L_value) * Math.sin((nz_value * Math.PI * z) / L_value);
    };

    console.log(calculate_wave_function(0,5, 0.5, 0.5))

    //2. make function that sets opacity from value
    function Trace(x, y, z) {
        let percent =
            Math.round((calculate_wave_function(x, y, z) ** 2 / 8) * 1000) /
            1000;
        this.x = [x];
        this.y = [y];
        this.z = [z];
        this.mode = "markers";
        this.marker = {
            color: getRGB(percent),
            size: 5,
            symbol: "circle",
            line: {
                color: getRGB(percent),
                width: 1,
            },
            opacity: 1,
        };
        this.type = "scatter3d";
        this.showlegend = false;
    }

    //1. make function that creates points from [0,0,0] to [1,1,1]
    const getTrace = () => {
        let data = [];
        let i = 1;
        while (i < L_value * 20) {
            let t = 1;
            while (t < L_value * 20) {
                let s = 1;
                while (s < L_value * 20) {
                    let percent =
                        Math.round(
                            (calculate_wave_function(i / 20, t / 20, s / 20) ** 2 / 8) * 1000
                        ) / 1000;
                    //"improve" speed by only finding ones with probability over 0.01
                    if (percent > 0.1) {
                        data.push(new Trace(i / 20, t / 20, s / 20));
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
        console.log(getTrace().length);
        let test_trace = new Trace(0.5, 0.5, 0.5);
        console.log(test_trace.marker.opacity);
        Plotly.newPlot(graphDiv, getTrace(), layout);
    });
</script>

<div bind:this={graphDiv} class="w-screen h-screen" />

