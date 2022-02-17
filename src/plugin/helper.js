export function formatDate(date) {
    
    var d = typeof date === 'string' ? new Date(date) : date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');

}

export const objectMap = (obj, fn) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
)

export function formatDefaultDate(date) {
    if(typeof date === 'number'){
        // const time = date
        date = new Date(date * 1000)
        // d.setUTCSeconds(time)
    }
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = typeof date === 'string' ? new Date(date) : date,
        // month = '' + (d.getMonth() + 1),
        month = months[d.getMonth()],
        day = '' + d.getDate(),
        year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes()
    var second = d.getSeconds()

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join(' ')+' '+("0" + hour).slice(-2)+':'+("0" + minute).slice(-2) + ':' + ("0" + second).slice(-2);
}

export function blobToUint8Array(b) {
    var uri = URL.createObjectURL(b),
        xhr = new XMLHttpRequest(),
        i,
        ui8;

    xhr.open('GET', uri, false);
    xhr.send();

    URL.revokeObjectURL(uri);

    ui8 = new Uint8Array(xhr.response.length);

    for (i = 0; i < xhr.response.length; ++i) {
        ui8[i] = xhr.response.charCodeAt(i);
    }

    return ui8;
}

export function blobToBase64(blob){
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve,reject) => {
        return reader.onloadend = () => {
            return resolve(reader.result)
        };
    })
}

export const base64ToBlob = async (base64data,e) =>{
    if(e){
        e.preventDefault()
    }
    const res = await fetch(base64data);
    const blob = await res.blob();

    return blob
}

export const b64ToBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
};

export function formatUploadFileData(fileData){
    var mime = fileData.split(';base64,')[0]
    var mimeClean = mime.split(':')[1]
    var base64data = fileData.split(';base64,')[1]

    var result = {
        mime: mimeClean,
        base64data: base64data
    }

    return result
}
