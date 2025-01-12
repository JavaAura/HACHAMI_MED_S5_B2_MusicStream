import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly MIN_LOADING_TIME = 1500; // 1.5 seconds
  private loadingStartTime: number = 0;

  success(message: string) {
    const timeElapsed = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, this.MIN_LOADING_TIME - timeElapsed);

    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 3000,
        showConfirmButton: false
      });
    }, remainingTime);
  }

  error(message: string) {
    const timeElapsed = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, this.MIN_LOADING_TIME - timeElapsed);

    setTimeout(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      });
    }, remainingTime);
  }

  loading(message: string = 'Loading...') {
    this.loadingStartTime = Date.now();
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }

  async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    return result.isConfirmed;
  }
} 
