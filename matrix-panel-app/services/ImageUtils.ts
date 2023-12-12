
export function RGBToRGB565(red: number, green: number, blue: number) {
    let r = red >> 3;
    let g = green >> 2;
    let b = blue >> 3;
    return (r << 11) | (g << 5) | b;
}