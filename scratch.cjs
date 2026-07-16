/* eslint-disable */
const fs = require('fs');

const path = './content/services.ts';
let content = fs.readFileSync(path, 'utf8');

// The file exports `export const services: Service[] = [`
// We can use the typescript compiler API to transform it, but since we just want to rearrange items, 
// let's just do it cleanly using string manipulation. We'll split the file.
// The array starts at `export const services: Service[] = [` and ends at `];\n\nexport const serviceTitles`

const startIndex = content.indexOf('export const services: Service[] = [');
const endIndex = content.indexOf('];\n\nexport const serviceTitles');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find services array bounds');
    process.exit(1);
}

const beforeArray = content.slice(0, startIndex + 'export const services: Service[] = ['.length);
const arrayContentStr = content.slice(startIndex + 'export const services: Service[] = ['.length, endIndex);
const afterArray = content.slice(endIndex);

// split the array into individual objects. 
// They are separated by `  },\n  {`
const rawObjects = arrayContentStr.split(/\n  \},\n  \{\n/g);

// Fix up the split edges
const objects = rawObjects.map((obj, index) => {
    let clean = obj.trim();
    if (clean.startsWith('{')) clean = clean.substring(1).trim();
    if (clean.endsWith('}')) clean = clean.substring(0, clean.length - 1).trim();
    return clean;
});

let metaAds = null;
let fullStack = null;
let others = [];

for (const obj of objects) {
    if (obj.includes('slug: "meta-ads"')) {
        metaAds = obj;
    } else if (obj.includes('slug: "full-stack-development"')) {
        fullStack = obj;
    } else {
        others.push(obj);
    }
}

// Re-order
const newOrder = [metaAds, fullStack, ...others];

// Re-number
const renumbered = newOrder.map((obj, i) => {
    const num = String(i + 1).padStart(2, '0');
    return obj.replace(/number: "\d+"/, `number: "${num}"`);
});

const newArrayContentStr = '\n  {\n    ' + renumbered.join('\n  },\n  {\n    ') + '\n  }\n';

fs.writeFileSync(path, beforeArray + newArrayContentStr + afterArray);
console.log('Successfully reordered services');
