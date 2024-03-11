// In OpenAIService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  constructor(private http: HttpClient) {}

  interpretCommand(commandText: string): Observable<any> {
    const body = {
      messages: [
        {
          // System messagesss providing instructions and context
          role: "system",
          content: `Here are some examples of commands and their corresponding navigation targets: 'Go home' should navigate to the homepage, 'Sign in' should navigate to the login page, 'Register' should navigate to the registration page, 'Find movies' should navigate to the movies page, 'Search for TV shows' should navigate to the TV shows page, 'Start search' should navigate to the search page.`
        },
        {
          // User message with the actual command
          role: "user",
          content: commandText
        }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      temperature: 0.5,
    };

    return this.http.post('/api/openai', body);
  }
}
