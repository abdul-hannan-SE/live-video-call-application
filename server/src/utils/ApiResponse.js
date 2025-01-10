class ApiResponse {
  constructor(
    statusCode = 200,
    message = "Success",
    data = null,
    success = true,
    meta = {},
    links = {}
  ) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.meta = meta;
    this.links = links;
    this.success = success;
  }
}
module.exports = ApiResponse;
