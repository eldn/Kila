const { generate } = require('./generate-declarations');

generate({
    outDir: './dist',
}).then((successed) => {
    if (successed) {
        console.log(`Successed.`);
    } else {
        console.error(`Failed to generate declaration files.`);
    }
});