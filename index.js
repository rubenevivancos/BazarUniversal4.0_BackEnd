const server = require('./src/app.js');
const { mongooseConnection } = require('./src/db.js');

const port = process.env.PORT || 3001; //Esto es importantisimo, ya que Vercel usa la variable PORT 


mongooseConnection.then(() => {
    server.listen(port, () => {
      console.log(`%s listening at ${port}`);
    });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});