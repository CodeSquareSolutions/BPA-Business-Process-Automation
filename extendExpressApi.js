var fs = require('fs');

fs.readFile('./expressApi.js', function(err, data) {
    if (err) throw err;
    fs.writeFile('./server/boot/root.js', data, function(err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    })
});


// function ReadAppend(file, appendFile){
//     fs.readFile(appendFile, function (err, data) {
//       if (err) throw err;
//       console.log('File was read');

//       fs.appendFile(file, data, function (err) {
//         if (err) throw err;
//         console.log('The "data to append" was appended to file!');

//       });
//     });
//   }
// // edit this with your file names
// file = '../server/boot/root.js';
// appendFile = './abcd.js';
// ReadAppend(file, appendFile);