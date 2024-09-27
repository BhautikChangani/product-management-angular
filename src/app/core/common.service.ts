import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  ByteStringToBlob(byteString: string, filename: string) : Blob {
    const binaryString = window.atob(byteString);

    // Create a Uint8Array to hold the binary data
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([bytes], { type: 'image/jpeg' }); // Adjust MIME type as needed
    return blob;
  }
}
