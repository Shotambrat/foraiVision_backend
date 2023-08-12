const express = require('express');
const axios = require('axios');

const cors = require('cors');
const config = require('config');

const app = express();
const port = config.get('PORT');

app.use(cors());

app.get('/user', (req, res) => {
    const token = req.headers.authorization;
    console.log(`Thats is token ${token}`)
    const url = 'https://login.yandex.ru/info';
    const headers = { 'Authorization': token};

    axios.get(url, { headers })
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'данные пользователя не загружены' });
    });
});

app.get('/user/data', (req, res) => {
    const token = req.headers.authorization;
    console.log(`IS IT REALY TOKEN ${token}`)
    const url = 'https://cloud-api.yandex.net/v1/disk/';
    const headers = { 'Authorization': `OAuth ${token}`,
                    'Content-Type': 'application/json' };

    axios.get(url, { headers })
    .then((response) => {
        const userData = response.data;
        res.send({ userData });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'данные пользователя не загружены' });
    });
});

app.post('/createFolder', (req, res) => {
    const token = req.headers.authorization;
    const url = 'https://cloud-api.yandex.net/v1/disk/resources';
    const headers = { 'Authorization': `OAuth ${token}`,
                    'Content-Type': 'application/json' };
    const params = { path: '/test_folder' };

    axios.put(url, null, { headers, params })
    .then(() => {
        res.send({ message: 'Папка создана.' });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Ошибка создания папки' });
    });
});

app.post('/uploadFile', (req, res) => {
    const token = req.headers.authorization;
    const url = 'https://cloud-api.yandex.net/v1/disk/resources/upload';
    const headers = { 'Authorization': `OAuth ${token}`,
                    'Content-Type': 'application/json' };
    const params = { path: '/test_folder/test_file.txt', overwrite: 'true' };
    const fileData = req.body.fileData;

    axios.get(url, { headers, params })
    .then((response) => {
        const uploadUrl = response.data.href;
        return axios.put(uploadUrl, fileData, { headers });
    })
    .then(() => {
        res.send({ message: 'ДАНные загружены..' });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Ошибка загрузки данных' });
    });
});

app.post('/moveToTrash', (req, res) => {
    const token = req.headers.authorization;
    const url = 'https://cloud-api.yandex.net/v1/disk/resources/move_to_trash';
    const headers = { 'Authorization': `OAuth ${token}`,
                        'Content-Type': 'application/json' };
    const params = { path: '/test_folder/test_file.txt' };

    axios.post(url, null, { headers, params })
    .then(() => {
        res.send({ message: 'Данные успешно перемещены в корзину' });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Ошибка перемещения данных в корзину' });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});