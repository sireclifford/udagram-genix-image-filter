import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req:express.Request, res:express.Response ) => {

    let { image_url } = req.query;
    console.log(image_url);


    await filterImageFromURL(image_url)
    .then((image) => {
      fs.readFile(image, (err, data) => {
        if(err) {
          res.status(422).send("Error processing the file.");
        }
        
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data);
        deleteLocalFiles(new Array(image));
      });              
    })
    .catch(error => {
      res.status(500).send("Error filtering the image file.")
    });
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();