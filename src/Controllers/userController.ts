import { getRepository } from "typeorm";
import { User } from "../entities/Users";
import axios from 'axios'
import { createClient } from 'redis';

const initRedis = async () => {
    const client = createClient();
    await client.connect();
    return client
}


export const getUsersData = async (req, res) => {

    const client = await initRedis();
    const cached = await client.get('users');
    if(cached) return res.json(JSON.parse(cached)).status(200);
    const response = await axios.get('https://api.chucknorris.io/jokes/categories');
    const categories = response.data;
    await client.set('users', JSON.stringify(categories));
    return res.json(categories).status(200);
}

export const createUser = async (req, res) => {
    
    const {email, password} = req.body;
    const userRepository = getRepository(User);
    const newUser = new User;
    newUser.email = email;
    newUser.password = password;
    await userRepository.save(newUser);

    return res.json(newUser).status(201);
}