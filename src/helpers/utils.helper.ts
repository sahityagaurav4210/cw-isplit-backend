class UtilsHelper {
  public getSafeUserPayload(payload: Record<string, any>) {
    const { password, ...rest } = payload;
    return rest;
  }
}

export default UtilsHelper;
