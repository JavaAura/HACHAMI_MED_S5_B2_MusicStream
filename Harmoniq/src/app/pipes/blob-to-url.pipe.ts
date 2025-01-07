import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blobToUrl',
  standalone: true
})
export class BlobToUrlPipe implements PipeTransform {
  transform(blob: Blob): string {
    return blob ? URL.createObjectURL(blob) : '';
  }
}
