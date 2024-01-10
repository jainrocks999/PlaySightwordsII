import {dbData} from '../types';

var SQLite = require('react-native-sqlite-storage');
const db = SQLite.openDatabase({
  name: 'dbSightWordsSecond.db',
  createFromLocation: 1,
});
export default async (name: string) => {
  return name != ''
    ? new Promise<dbData>((resolve, reject) => {
        let data: any = [];
        db.transaction((tx: any) => {
          tx.executeSql(
            `SELECT * FROM ${name}`,
            [],
            (tx: any, results: any) => {
              let len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                data.push(row);
              }
              resolve(data);
            },
            (err: any) => {
              console.log(err);
              reject(err);
            },
          );
        });
      })
    : [];
};
