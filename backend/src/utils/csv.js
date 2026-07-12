export const toCSV = (rows) => {
    if (!rows || rows.length === 0) return "";
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(",")];
    for (const row of rows) {
        const vals = headers.map(h => {
            let v = row[h] === null || row[h] === undefined ? "" : String(row[h]);
            if (v.includes(",") || v.includes('"') || v.includes("\n")) {
                v = '"' + v.replace(/"/g, '""') + '"';
            }
            return v;
        });
        lines.push(vals.join(","));
    }
    return lines.join("\n");
};
