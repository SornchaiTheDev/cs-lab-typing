export interface ListItem {
  name: string;
  data: ListItem[];
}

export interface Relation {
  summary: { name: string; amount: number }[];
  object: ListItem[];
}
