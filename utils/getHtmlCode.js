const axios = require('axios');

const generateHtmlCodeForResponse = (listItems)=>{
    const htmlResponse = `
    <html>
    <head></head>
    <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>
            ${listItems.join('')}
        </ul>
    </body>
    </html>`;


    return htmlResponse;
}

function fetchTitle(url, callback) {
    axios.get(url)
      .then(response => {
        const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
        callback(null, title);
      })
      .catch(error => {
        if (url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
          axios.get(url)
            .then(response => {
              const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
              const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
              callback(null, title);
            })
            .catch(error => {
              callback(error);
            });
        } else {
          callback(error);
        }
      });
  }


module.exports = { generateHtmlCodeForResponse, fetchTitle}