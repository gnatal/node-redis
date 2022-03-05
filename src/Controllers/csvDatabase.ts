import * as fs from "fs";
import * as path from "path";
import { createClient } from 'redis';

interface IUserData {
    nome: string;
    nascimento: string;
    endereco: string;
    cep: string;
    cidade: string;
    estado: string;
}

const buildJsonData = (headers, data) => {
    const jsonData: Array<IUserData> = [];
    data.map((row:Array<string>) => {
        const jsonRow:IUserData= {
            nome: '',
            nascimento: '',
            endereco: '',
            cep: '',
            cidade: '',
            estado: ''
        };
        headers.forEach((header:string, i:number) => {
            jsonRow[header.trim()] = row[i];
        });
        jsonData.push(jsonRow);
    });
    return jsonData;
}

const readFile =  () => {
    const csvFilePath = path.resolve(__dirname, '../data.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).filter(line => {
        const lineData = line.split(',');
        return lineData.length === headers.length;
    }).map(line => {
        return line.split(',');
    });

    return buildJsonData(headers, data);
}

export const getUsersData = async (req, res) => {
    const client = createClient();
    await client.connect();
    // const cached = await client.get('users');
    // if(cached){
    //     return res.json(JSON.parse(cached)).status(200);
    // }
    const users = readFile();
    // await client.set('users', JSON.stringify(users));
    return res.json(users).status(200);
}