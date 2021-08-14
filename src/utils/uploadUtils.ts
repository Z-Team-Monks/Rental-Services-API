export function getImageUrl(file : any){
    return "http://localhost:5000/" + file.path.substring(8,file.path.length);
}