import { ApiStatus, type ApiDetails } from "../constants/api.constants";

class CWISplitAPIReply {
  private status?: ApiStatus;
  private reqId?: string;
  private details?: ApiDetails;

  constructor(status?: ApiStatus, reqId?: string, details?: ApiDetails) {
    if (status) this.status = status;
    if (reqId) this.reqId = reqId;
    if (details) this.details = details;
  }

  public get apiStatus(): ApiStatus {
    return this.status ?? ApiStatus.UNSET;
  }

  public get apiReqId(): string {
    return this.reqId ?? "";
  }

  public get apiDetails(): ApiDetails {
    return this.details ?? { message: "", data: null };
  }

  public set apiStatus(status: ApiStatus) {
    this.status = status;
  }

  public set apiReqId(reqId: string) {
    this.reqId = reqId;
  }

  public set apiDetails(details: ApiDetails) {
    this.details = details;
  }
}

export default CWISplitAPIReply;
