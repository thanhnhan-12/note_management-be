import * as mysql from 'mysql2';
import * as cors from 'cors';
import * as express from 'express';
import router from './routes/auth';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'testdb',
    port: 3306,
});

connection.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
