import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('../Penanaman_KKP_2020-2024_Mgng.xlsx');
const sheet = workbook.Sheets['Penanaman_KKP_2020-2024'];
const data = xlsx.utils.sheet_to_json(sheet) as any[];

const byYear = {};
for (const row of data) {
    const year = row['Tahun'];
    const luas = row[' Luas '];
    if (!byYear[year]) byYear[year] = 0;
    byYear[year] += luas || 0;
}
console.log(byYear);

const sheet2 = workbook.Sheets['Jmlh Luasan Penanaman'];
if(sheet2) {
    console.log("Sheet Jmlh Luasan Penanaman:", xlsx.utils.sheet_to_json(sheet2));
}

