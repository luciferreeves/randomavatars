const fs = require('fs');
const path = require('path');
const pathWalker = require('walk');
export default class RandomAvatars {
    constructor(string, hashcount = 11, ignoreext = true) {
        /**
         * This creates our avatar.
         * Takes in a string and makes an picture out of it.
         */
        let string = string;
        if (ignoreext) string = removeExts(this, string);

        this.hexdigest = crypto.createHash('sha512').update(string).digest('hex');
        this.hasharray = [];
        // Start this at 4, so earlier is reserved
        // 0 = Color
        // 1 = Set
        // 2 = bgset
        // 3 = BG
        this.iter = 4;
        createhashes(this, hashcount);
        this.resourceDir = __dirname + '/';
        // Get the list of Backgrounds and Robosets
        this.sets = this.listDirs(resourceDir + 'sets')
        this.bgsets = this.listDirs(resourceDir + 'backgrounds');
        
        // Get the colors in set 1
        this.colors = this.listDirs(resourceDir + 'sets/set1');
        this.format = 'png';
    }

    removeExts(string) {
        /**
         * Sets the input string to create an avatar
         */
    
        // If the user hasn't disabled it, we will detect image extensions, such as .png, .jpg, etc.
        // We'll remove them from the string before hashing.
        // This ensures that /Bear.png and /Bear.bmp will send back the same image, in different formats.
    
        let input = (String(string)).toLowerCase();
        if (input.endsWith('.png') || input.endsWith('.gif') || input.endsWith('.jpg') || input.endsWith('.bmp') || input.endsWith('.jpeg') || input.endsWith('.ppm') || input.endsWith('.datauri')) {
            let format = input.substr(input.lastIndexOf('.') + 1, input.length);
            if (format.toLowerCase() === 'jpg') format = 'jpg';
            this.format = format;
            input = input.substr(0, input.lastIndexOf('.'));
        }
        return input;
    }
    
    createhashes(count) {
        /**
         * Breaks up our hash into slots, so we can pull them out later.
         * Essentially, it splits our SHA/MD5/etc into X parts.
         */
    
        for (const i of Array(count).keys()) {
            // Get 1/numblocks of the hash
            const blocksize = parseInt(this.hexdigest.length/count);
            const currentStart = ((i + 1) * blocksize) - blocksize;
            const currentEnd = (1 +i) * blocksize;
            this.hasharray.push(parseInt(this.hexdigest.substr(currentStart, currentEnd), 16));
        }
        this.hasharray = this.hasharray + this.hasharray;
    }

    listDirs(path) {
        return fs.readdirSync(path, {withFileTypes: true}).filter((dir) => dir.isDirectory()).map((dir) => dir.name);
    }

    getListOfFiles(path) {
        // Go through each subdirectory of `path`, and choose one file from each to use in our hash.
        // Continue to increase self.iter, so we use a different 'slot' of randomness each time.

        const walker = pathWalker.walk(path);
        const chosenFiles = [];

        // Get a list of all subdirectories
        const directories = [];
        walker.on('directory', (root, fileStats, next) => {
            if (fileStats.name.substr(0,1) !== '.') {
                directories.push(path.join(root, fileStats.name));
            }
            next();
        });

        // Go through each directory in the list, and choose one file from each.
        // Add this file to our master list of robotparts.

        for (const directory of directories) {
            const filesInDir = [];
            for (const imagefile of this.listDirs(directory)) {
                filesInDir.push(imagefile);
            }

            // Use some of our hash bits to choose which file
            const elementInList = this.hasharray[this.iter] % filesInDir.length();
            chosenFiles.push(filesInDir[elementInList]);
            this.iter += 1;
        }

        return chosenFiles;
    }
}
