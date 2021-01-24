export default class RandomAvatars {
    constructor(string, hashcount=11, ignoreext=true) {
        /**
         * This creates our avatar.
         * Takes in a string and makes an picture out of it.
         */
        if (ignoreext) removeExts(this, string);

        this.format = 'png'
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
