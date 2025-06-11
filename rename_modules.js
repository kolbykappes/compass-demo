const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'modules');

fs.readdir(modulesDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        if (file.startsWith('m') && file.endsWith('.json')) {
            const filePath = path.join(modulesDir, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }
                try {
                    const moduleData = JSON.parse(data);
                    if (moduleData.metadata && moduleData.metadata.title && moduleData.metadata.module_type) {
                        const type = moduleData.metadata.module_type.split('(')[1].split(')')[0].toLowerCase().replace(/ /g, '_');
                        const title = moduleData.metadata.title.toLowerCase().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '').replace(/ /g, '_');
                        const newFileName = `${type}_${title}.json`;
                        const newFilePath = path.join(modulesDir, newFileName);

                        fs.rename(filePath, newFilePath, err => {
                            if (err) {
                                console.error(`Error renaming file ${file}:`, err);
                            } else {
                                console.log(`Renamed ${file} to ${newFileName}`);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore placeholder files that don't have the right structure
                    if (e instanceof SyntaxError) {
                        console.log(`Skipping placeholder file: ${file}`);
                    } else {
                        console.error(`Error processing file ${file}:`, e);
                    }
                }
            });
        }
    });
}); 