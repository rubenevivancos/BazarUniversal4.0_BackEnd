const server = require('./src/app.js');
const { conn } = require('./src/db.js');

const port = process.env.PORT || 3001; //Esto es importantisimo, ya que Vercel usa la variable PORT 


conn.sync().then(() => {
    server.listen(port, () => {
      console.log(`%s listening at ${port}`);
    });
});