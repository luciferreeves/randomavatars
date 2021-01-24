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
        this.format = 'png';
    }
}

function removeExts(currentClass, string) {
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
        currentClass.format = format
        input = input.substr(0, input.lastIndexOf('.'));
    }
    return input;
}

function createhashes(currentClass, count) {
    /**
     * Breaks up our hash into slots, so we can pull them out later.
     * Essentially, it splits our SHA/MD5/etc into X parts.
     */

    for (const i of Array(count).keys()) {
        // Get 1/numblocks of the hash
        const blocksize = parseInt(currentClass.hexdigest.length/count);
        const currentStart = ((i + 1) * blocksize) - blocksize;
        const currentEnd = (1 +i) * blocksize;
        currentClass.hasharray.push(parseInt(currentClass.hexdigest.substr(currentStart, currentEnd), 16));
    }
    currentClass.hasharray = currentClass.hasharray + currentClass.hasharray
}
