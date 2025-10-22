const fs = require('fs');
const path = require('path');

// 🔹 snake_case → camelCase
function snakeToCamel(str) {
    return str.replace(/_([a-zA-Z])/g, (_, c) => c.toUpperCase());
}

// 🔹 UPPER_SNAKE_CASE → camelCase
function upperSnakeToCamel(str) {
    return str
        .toLowerCase()
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

// 🔹 PascalCase hoặc FToken... → fToken...
function toCamel(str) {
    if (str.includes('_')) {
        if (/^[A-Z0-9_]+$/.test(str)) return upperSnakeToCamel(str);
        return snakeToCamel(str);
    }
    if (/^[A-Z]/.test(str) && /[a-z]/.test(str)) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}

// 🔁 Đệ quy chuyển key & value (trừ address, metadata, docs)
function convertKeysAndValuesDeep(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysAndValuesDeep);
    } else if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            const value = obj[key];

            // Các key đặc biệt => giữ nguyên key và value
            if (['address', 'metadata', 'docs'].includes(key)) {
                newObj[key] = value;
                continue;
            }

            // Đổi key sang camelCase
            const newKey = toCamel(key);

            if (typeof value === 'string') {
                newObj[newKey] = toCamel(value);
            } else {
                newObj[newKey] = convertKeysAndValuesDeep(value);
            }
        }
        return newObj;
    } else if (typeof obj === 'string') {
        return toCamel(obj);
    }
    return obj;
}

// 🧠 CLI usage: node convert_idl.js input.json output.json
const [, , inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
    console.error('❌ Cách dùng:');
    console.error('   node convert_idl.js <input.json> <output.json>');
    process.exit(1);
}

const inputPath = path.resolve(inputFile);
const outputPath = path.resolve(outputFile);

try {
    const text = fs.readFileSync(inputPath, 'utf8');
    const json = JSON.parse(text);

    const converted = convertKeysAndValuesDeep(json);

    fs.writeFileSync(outputPath, JSON.stringify(converted, null, 2));
    console.log(`✅ Đã xử lý IDL và lưu sang: ${outputPath}`);
} catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
}
