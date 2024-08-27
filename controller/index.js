const async = require('async');
const { generateHtmlCodeForResponse, fetchTitle } = require("../utils/getHtmlCode");

const getUrlsToGtTitles = (req, res) => {
    const addresses = req.query.address;

    if (!addresses) {
      return res.status(400).send('No address provided');
    }
  
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];
    
    // Use async.map to handle asynchronous requests
    async.map(addressArray, (address, callback) => {
      let url = address.startsWith('http') ? address : `http://${address}`;
  
      fetchTitle(url, (err, title) => {
        if (err) {
          callback(null, `<li>${address} - NO RESPONSE</li>`);
        } else {
          callback(null, `<li>${url} - "${title}"</li>`);
        }
      });
    }, (err, results) => {
        if (err) {
            // Handle any unexpected errors
            return res.status(500).send('Internal Server Error');
        }

        const htmlCode = generateHtmlCodeForResponse(results);
        res.status(200).send(htmlCode);
    });
};


module.exports =  { getUrlsToGtTitles }