import * as xlsx from 'xlsx';
import * as fs from 'fs';

const workbook = xlsx.readFile('../Penanaman_KKP_2020-2024_Mgng.xlsx');
let out = "Sheet names: " + workbook.SheetNames.join(', ') + "\n";
for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    out += `\nSheet: ${sheetName}\n`;
    out += `Total rows: ${data.length}\n`;
    if (data.length > 0) {
        out += `Sample 1: ${JSON.stringify(data[0], null, 2)}\n`;
        if (data.length > 1) {
            out += `Sample 2: ${JSON.stringify(data[1], null, 2)}\n`;
        }
    }
}
fs.writeFileSync('output.json', out, 'utf-8');
