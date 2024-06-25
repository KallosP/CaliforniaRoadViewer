/*
    TODO:
        1) Understand the cctv data (e.g. the time range the referenceImage columns can show, are there a max of 12 ref images or more?, etc)
        2) Be smart with data parsing


        - Store all data into an array that holds arrays. these inner arrays each represent one camera. the outer array
        represents all the cameras.
        - the inner array's indexes can be represented with enums so it's better to understand what that value represents.
        the enums are defined from the columns in the csv file
*/
export async function readCSV(file: string){
    try {
        const response = await fetch(file);
        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        return dataStr 
    } catch (error) {
        console.error('Error fetching CCTV data:', error);
        return null
    }
}