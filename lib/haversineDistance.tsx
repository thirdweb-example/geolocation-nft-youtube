import { Coordinates } from "../utils/types/types";

function toRad(x: number): number {
    return x * Math.PI / 180;
}

export function haversineDistance(coords1: Coordinates, coords2: Coordinates, isMiles: boolean = false): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    if (isMiles) d /= 1.60934; // Convert km to miles

    return d;
}