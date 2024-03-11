import { Component } from '@angular/core';
import { VoiceRecognitionService } from '../../src/app/core/services/voice-recognition.service';
import { OpenAIService } from '../../src/app/core/services/open-ai.service';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './voice-command.component.html',
  styleUrls: ['./voice-command.component.scss']
})
export class VoiceCommandComponent {
  constructor(
    private voiceRecognitionService: VoiceRecognitionService,
    private openAIService: OpenAIService,
    private router: Router
  ) {}

  debounceTimeout: any;

listenForCommands() {
  this.voiceRecognitionService.start();
  this.voiceRecognitionService.recognition.addEventListener('result', (event) => {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const lastResultIndex = event.results.length - 1;
      const commandText = event.results[lastResultIndex][0].transcript.trim();
      console.log('Captured Command Text:', commandText);
      this.processCommandText(commandText);
    }, 500); // Adjust debounce time as needed
  });
}

processCommandText(commandText: string) {
  console.log('Command Text to OpenAI:', commandText);
  this.openAIService.interpretCommand(commandText).subscribe(response => {
    console.log('Raw OpenAI Response:', response);
    if (response && response.choices && response.choices.length > 0) {
      const responseContent = response.choices?.[0]?.message?.content ?? '';
      const intent = this.extractIntentFromResponse(responseContent);
      console.log('Extracted Intent:', intent);
      this.navigateBasedOnIntent(intent);
    } else {
      console.error('Invalid response structure:', response);
    }
  }, error => {
    console.error('Error making the request:', error);
  });
}

extractIntentFromResponse(responseText: string): string {

  console.log('OpenAI Response:', responseText);
  const lowerCaseResponse = responseText.toLowerCase();


  if (lowerCaseResponse.includes('homepage') || lowerCaseResponse.includes('go home')) {
    return 'go to home';
  } else if (lowerCaseResponse.includes('login') || lowerCaseResponse.includes('sign in')) {
    return 'open login';
  } else if (lowerCaseResponse.includes('register') || lowerCaseResponse.includes('sign up')) {
    return 'open register';
  } else if (lowerCaseResponse.includes('movies')) {
    return 'open movies';
  } else if (lowerCaseResponse.includes('tv shows') || lowerCaseResponse.includes('series')) {
    return 'open tv shows';
  } else if (lowerCaseResponse.includes('search') || lowerCaseResponse.includes('find')) {
    return 'open search';
  }

  return ''; // No intent recognized
}

// toggleVoiceRecognition() {
//   this.voiceRecognitionService.toggleListening();
// }


navigateBasedOnIntent(intent: string) {
  console.log('Navigating based on intent:', intent);
  switch (intent.toLowerCase()) {
    case 'go to home':
      this.router.navigate(['/']);
      break;
    case 'open login':
      this.router.navigate(['/login']);
      break;
    case 'open register':
      this.router.navigate(['/register']);
      break;
    case 'open movies':
      this.router.navigate(['/movies']);
      break;
    case 'open tv shows':
      this.router.navigate(['/tv-shows']);
      break;
    case 'open search':
      this.router.navigate(['/search']);
      break;
    default:
      console.error('Intent not recognized or not supported:', intent);
  }
}
}
