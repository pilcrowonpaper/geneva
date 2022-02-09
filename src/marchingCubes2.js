import { triTable } from "./triTable";

export const marchingCubes = (pointsObj, max_x, max_y, max_z) => {
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
                const vertexIndex = getVertexIndex(cubeVertex, pointsObj);
                if (vertexIndex !== 0 && vertexIndex !== 255) {
                    const edgeIndex = triTable[vertexIndex];
                    const cubeMeshPoints = getCubeMeshPoints(edgeIndex, cubeVertex)
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

const getVertexIndex = (cubeArray, pointsObject) => {
    let triIndex = 0;
    let i = 0;
    while (i < cubeArray.length) {
        if (pointsObject[cubeArray[i][0]][cubeArray[i][1]].includes(cubeArray[i][2])) {
            triIndex += 2 ** i;
        }
        i++;
    }
    return triIndex;
};

const getCubeMeshPoints = (edgeArray, cubeArray) => {
    let meshPoints = [];
    let i = 0;
    while (i < edgeArray.length) {
        meshPoints = meshPoints.concat(getEdgePoints(cubeArray, edgeArray[i]))
        i++;
    }
    return meshPoints
};

const getEdgePoints = (cubeArray, i) => {
    if (i < 8) {
        if (i !== 3 && i !== 7) {
            return [
                (cubeArray[i][0] + cubeArray[i + 1][0]) / 2,
                (cubeArray[i][1] + cubeArray[i + 1][1]) / 2,
                (cubeArray[i][2] + cubeArray[i + 1][2]) / 2,
            ];
        } else {
            return [
                (cubeArray[i][0] + cubeArray[i - 3][0]) / 2,
                (cubeArray[i][1] + cubeArray[i - 3][1]) / 2,
                (cubeArray[i][2] + cubeArray[i - 3][2]) / 2,
            ];
        }
    } else {
        return [
            (cubeArray[i - 4][0] + cubeArray[i - 8][0]) / 2,
            (cubeArray[i - 4][1] + cubeArray[i - 8][1]) / 2,
            (cubeArray[i - 4][2] + cubeArray[i - 8][2]) / 2,
        ];
    }
};