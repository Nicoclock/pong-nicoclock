/**
 * Module implémentant les commandes de base de sqitch
 * Il permet de déployer/supprimer les migrations sur un schéma de test
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class SqitchHandler {

    schema;

    constructor(schema) {
        this.schema = schema;
        if (!fs.existsSync(process.cwd()+'/sqitch.conf'))
            throw new Error(`No sqitch.conf found in ${process.cwd()}`)
    };

    async execute(command) {
        try {
            const result = await exec(`cd ${process.cwd()}; ${command}`);
            return result.stdout;
        } catch (error) {
           return error.stdout;
        }
    };

    credentials() {
        return `PGUSER=${this.schema} PGPASSWORD=${this.schema}`;
    };

    async seed(filePath) {
        const fullPath = path.resolve(process.cwd()+filePath);
        if (!fs.existsSync(fullPath))
            throw new Error(`File ${filePath} doesn't exist`);
        return await this.execute(`${this.credentials()} psql -d ${process.env.PGDATABASE} -f ${fullPath}`);

    };

    async deploy(migration) {
        return await this.execute(`${this.credentials()} sqitch deploy${migration ? ` ${migration}` : ''} --registry sqitch_${this.schema}`);
    };

    async revert(migration) {
        return await this.execute(`${this.schema ? this.credentials()+' ' : ''}sqitch revert -y${migration ? ` ${migration}` : ''} --registry sqitch_${this.schema}`);
    };

    async verify(migration) {
        return await this.execute(`${this.schema ? this.credentials()+' ' : ''}sqitch verify${migration ? ` ${migration}` : ''} --registry sqitch_${this.schema}`);
    }


};

module.exports = SqitchHandler;