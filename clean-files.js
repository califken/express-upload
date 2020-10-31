const thisfs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    process = require("process");

const foldersToClean = [
    'files',
    'uploads'
];
console.log(foldersToClean);

function cleandir(uploadsDir) {
    let i = 0;
    thisfs.readdir(uploadsDir, function(err, files) {
        files.forEach(function(file, index) {
            thisfs.stat(path.join(uploadsDir, file), function(err, stat) {
                var endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + 0;
                if (now > endTime) {
                    return rimraf(path.join(uploadsDir, file), function(err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('successfully deleted');
                        i++;
                    });
                }
            });
        });

    });
    return "Cleaned " + uploadsDir + ": " + i + " files";
}

foldersToClean.map(cleandir);
console.log('Clean is complete.');
//process.exit(0);