export interface Room {
  uid: string;
  game: string;
  version: string;
  name: string;
  open: boolean;
  data: any;
  limit: number;
  clients: any[];
}
