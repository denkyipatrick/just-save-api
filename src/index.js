'use strict';

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const https = require('https');

const application = express();

application.use(cors());
application.use(express.json());
application.disable('x-powered-by');
application.set('port', process.env.NODE_PORT);

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  application.use(morgan('dev'));
}

// import routes
require('./routes/role.routes')(application);
require('./routes/staff.routes')(application);
require('./routes/orders.routes')(application);
require('./routes/branch.routes')(application);
require('./routes/company.routes')(application);
require('./routes/product.routes')(application);
require('./routes/staffrole.routes')(application);
require('./routes/branchproduct.routes')(application);

if (process.env.USE_HTTPS.indexOf('yes') > -1) {
  https.createServer({
    key: fs.readFileSync('./ssl/lollandscreditunion_com.key'),
    cert: fs.readFileSync('./ssl/lollandscreditunion_com.crt'),
    ca: fs.readFileSync('./ssl/lollandscreditunion_com.ca-bundle'),
  }, application).listen(application.get('port'), () => {
    console.log(`Application server running securely on ${application.get('port')}`);
  });
} else {
  application.listen(application.get('port'), () => {
    console.log(`APPLICATION API running on ${application.get('port')}`);
  });
}

