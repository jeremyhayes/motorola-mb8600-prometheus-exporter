import express from 'express';
import collector from './collector.js'

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.send({
        status: 'healthy'
    });
});

app.get('/metrics', async (req, res) => {
    const registry = await collector();

    res.set('Content-Type', registry.contentType);
    return res.end(await registry.metrics());
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
