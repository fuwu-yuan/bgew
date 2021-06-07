export interface Response {
  status: "success"|"error";
  code: string;
  message?: string;
  data?: any;
}
