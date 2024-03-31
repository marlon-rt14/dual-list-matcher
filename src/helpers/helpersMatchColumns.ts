import { IConnection, IItem } from "../components/MatchColumns";

const LINE_COLORS = [
  "#D875C7",
  "#912BBC",
  "#C1D875",
  "#D20062",
  "#D6589F",
  "#97E7E1",
  "#6AD4DD",
  "#7AA2E3",
  "#E9A89B",
  "#FFC94A",
  "#FF9800",
  "#FA7070",
  "#C6EBC5",
  "#2C7865",
  "#90D26D",
  "#8B93FF",
  "#5755FE",
  "#FF71CD",
  "#673F69",
  "#EFBC9B",
  "#FF5BAE",
  "#401F71",
  "#BE7B72",
  "#FDAF7B",
  "#496989",
  "#E2F4C5",
  "#FF204E",
  "#67C6E3",
  "#FFC700",
  "#FFF455",
  "#891652",
  "#FC819E",
  "#F7418F",
  "#F1EF99",
  "#59D5E0",
  "#6420AA",
  "#FF3EA5",
  "#387ADF",
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * LINE_COLORS.length + 1);
  return LINE_COLORS[randomIndex];
};

export const isObject = (item: unknown) => {
  if (item && typeof item === "object") return true;
  return false;
};

export const hasId = (item: unknown) => {
  if (
    isObject(item) &&
    "id" in (item as Record<string, unknown>) &&
    typeof (item as Record<string, unknown>).id === "string"
  )
    return true;
  return false;
};

export const getStringId = (item: unknown): string => {
  if (hasId(item)) {
    return (item as Record<string, unknown>).id as string;
  }
  return "";
};

export const createItem = (item: unknown, index: number): IItem => {
  return { id: (item as Record<string, unknown>).id as string, index };
};


export const hasMatchingEndId = (connection: IConnection, description: unknown): boolean => {
  return connection.end === getStringId(description);
};
