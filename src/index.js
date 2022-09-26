import app from './server';
import './config/db'

app.listen(app.get('port'));
console.log(`Server connected on port ${ app.get('port')}`);