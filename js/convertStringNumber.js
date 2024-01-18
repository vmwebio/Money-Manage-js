export const convertStringNumber = (str) => {
    const noSpaceStr = str.replace(/\s+/g, ''); // cut whitespace
    const num = parseInt(noSpaceStr); // string to number

    if (!isNaN(num) && isFinite(num)) {
        return num;
    } else {
        return false;
    }
};