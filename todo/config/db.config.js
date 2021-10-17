const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const url =
  DB_USER && DB_PASSWORD
    ? `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
    : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
console.log(url);
module.exports = {
  url,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
};
