import { StatusCodeEnums } from "./../enums/StatusCode.enum";

export interface ResponseModel<DataType = unknown> {
  data: DataType;
  httpCode: number;
}

export interface ResponseData {
  statusCode: StatusCodeEnums;
  statusIsOk: boolean;
  statusMessage: string;
  statusPath: string;
  error?: any;
}

export interface ReadAllFilterProps {
  page?: number;
  pageSize?: number;
  offset?: number;
  name?: string;
  search_text?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
