import  {  Region } from "react-native-maps";


export const PETERBURG_BOUNDS = {
  north: 60.10,
  south: 59.70,
  east: 30.50,
  west: 30.10,
} as const;


export const clampRegionToSPB = (r: Region): Region => {
  const latitude = Math.min(Math.max(r.latitude, PETERBURG_BOUNDS.south), PETERBURG_BOUNDS.north);
  const longitude = Math.min(Math.max(r.longitude, PETERBURG_BOUNDS.west), PETERBURG_BOUNDS.east);

  const minDelta = 0.02;
  const maxDelta = 0.20;

  const latitudeDelta = Math.min(Math.max(r.latitudeDelta, minDelta), maxDelta);
  const longitudeDelta = Math.min(Math.max(r.longitudeDelta, minDelta), maxDelta);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};