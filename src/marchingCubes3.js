import triTable from "./triTable.json";

export const marchingCubes = (valueObj, max_x, max_y, max_z, minimum_percent) => {
    let meshPoints = [];
    let x_array = []
    let count = 0
    let x = -1 * max_x
    while (x <= max_x) {
        let y = -1 * max_y
        while (y <= max_y) {
            let z = -1 * max_z
            while (z <= max_z) {
                count++
                const cubeVertex = getCubeVertex(x, y, z);
                const vertexIndex = getVertexIndex(cubeVertex, valueObj, minimum_percent);
                if (vertexIndex > 0 && vertexIndex < 255) {
                    const edgeIndex = triTable[vertexIndex];
                    const cubeMeshPoints = getCubeMeshPoints(edgeIndex, cubeVertex, minimum_percent, valueObj)
                    meshPoints = meshPoints.concat(cubeMeshPoints)
                }
                z++
            }
            y++
        }
        x_array.push(x)
        x++
    }
    console.log(count)
    console.log(meshPoints)
    return {
        mesh: meshPoints,
        cubes: count
    }
};

const getCubeVertex = (x, y, z) => {
    return [
        [x, y, z + 1],
        [x + 1, y, z + 1],
        [x + 1, y, z],
        [x, y, z],
        [x, y + 1, z + 1],
        [x + 1, y + 1, z + 1],
        [x + 1, y + 1, z],
        [x, y + 1, z],
    ];
};

const getVertexIndex = (cubeArray, valueObject, minimum_percent) => {
    let triIndex = 0;
    let i = 0;
    while (i < cubeArray.length) {
        if (valueObject[cubeArray[i][0]][cubeArray[i][1]][cubeArray[i][2]] > minimum_percent) {
            triIndex += 2 ** i;
        }
        i++;
    }
    return triIndex;
};

const getCubeMeshPoints = (edgeArray, cubeArray, minimum_percent, valueObject) => {
    let meshPoints = [];
    let i = 0;
    while (i < edgeArray.length) {
        meshPoints = meshPoints.concat(getEdgePoints(cubeArray, edgeArray[i], minimum_percent, valueObject))
        i++;
    }
    return meshPoints
};

const getEdgePoints = (cubeArray, i, minimum_percent, valueObject) => {
    let point1 = []
    let point2 = []
    let point1_value
    let point2_value
    const findPoint = (pos1, pos2, val1, val2) => {
        let m = Math.abs(val1 - minimum_percent)
        let n = Math.abs(val2 - minimum_percent)
        return [
            (n * pos1[0] + m * pos2[0]) / (m + n),
            (n * pos1[1] + m * pos2[1]) / (m + n),
            (n * pos1[2] + m * pos2[2]) / (m + n)
        ]
    }
    if (i < 8) {
        if (i !== 3 && i !== 7) {
            point1 = cubeArray[i]
            point2 = cubeArray[i + 1]
            point1_value = valueObject[point1[0]][point1[1]][point1[2]]
            point2_value = valueObject[point2[0]][point2[1]][point2[2]]
        } else {
            point1 = cubeArray[i]
            point2 = cubeArray[i - 3]
            point1_value = valueObject[point1[0]][point1[1]][point1[2]]
            point2_value = valueObject[point2[0]][point2[1]][point2[2]];
        }
    } else {
        point1 = cubeArray[i - 4]
        point2 = cubeArray[i - 8]
        point1_value = valueObject[point1[0]][point1[1]][point1[2]]
        point2_value = valueObject[point2[0]][point2[1]][point2[2]];
    }
    return findPoint(point1, point2, point1_value, point2_value)
};