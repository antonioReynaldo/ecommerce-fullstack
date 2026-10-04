export type ObjectCategory = {
  id: number;
  name: string;
  children: ObjectCategory[];
};

export type CategoryMapType = {
  id: number;
  name: string;
  parentId: null | number;
};
