export const orderPalette = [
    "rgba(255,230,128,0.87)"
]
export const tagsPalette = [
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
    "#ffc6d3",
    "#ffebc6",
]

// create a hash number for determine the color by the tag name
export function determineColor(string: string, digits: number):number {
    var m = Math.pow(10, digits + 1) - 1;
    var phi = Math.pow(10, digits) / 2 - 1;
    var n = 0;
    for (var i = 0; i < string.length; i++) {
        n = (n + phi * string.charCodeAt(i) + 3) % m;
    }
    return n;
}