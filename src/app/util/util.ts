import {ElementRef} from '@angular/core';

export function util(error: any): string {
  const splitError = error.split('/');
  return splitError[splitError.length - 1].replace('-', ' ');
}

export function scrollToBottom(element: ElementRef): void {
  try {
    setTimeout(() => {
  const container = element.nativeElement;
  container.scrollTop = container.scrollHeight;
}, 0);
} catch (err) { }
}
