import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import bindRoutes from './routes.mjs';

// Create a new express app and give reference to the app
// We don't want to call express() twice that runs another server
const app = express();
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// This parses the data 
app.use(express.json())

// When we apply middleware, we need to apply it to this particular instance
bindRoutes(app);

const PORT = process.env.PORT || 3002;
app.listen(PORT);