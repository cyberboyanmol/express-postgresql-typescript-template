export type Status = {
  success: string;
  failed: string;
};

export interface GlobalConstants {
  status: Status;
  statusCode: {
    [key: string]: {
      statusCodeName: string;
      code: number;
    };
  };
}
