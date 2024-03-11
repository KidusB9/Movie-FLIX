import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition: any;
  isListening = false;
  text = '';

  constructor() {
    const { webkitSpeechRecognition }: IWindow = window as unknown as IWindow;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      this.text += transcript;
      console.log(this.text);
    });

    this.recognition.addEventListener('end', () => {
      if (this.isListening) {
        this.recognition.start();
      }
    });
  }

  start() {
    this.isListening = true;
    this.recognition.start();
  }

  stop() {
    this.isListening = false;
    this.recognition.stop();
  }

  toggleListening() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
