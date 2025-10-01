import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Step 1: Listen for "child-ready" handshake from iframe
    window.addEventListener('message', this.handleChildReady.bind(this));
  }

  handleChildReady(event: MessageEvent) {
    if (event.origin !== 'https://child-app-domain.com') return;

    // Step 2: Confirm this is a handshake
    if (event.data.type === 'child-ready') {
      const userId = 'user123';
      const orgId = 'org456';

      // Step 3: Ask Parent API to get JWT from Child API
      this.http.post<any>('https://parent-api.com/api/relaytoken/get-child-token', {
        userId,
        orgId
      }).subscribe(res => {
        const token = res.token;

        // Step 4: Send token and user context to iframe
        const iframe = document.getElementById('child-frame') as HTMLIFrameElement;
        const message = {
          type: 'auth-data',
          payload: {
            token,
            userId,
            orgId
          }
        };

        iframe.contentWindow?.postMessage(message, 'https://child-app-domain.com');
        console.log('Parent app sent auth-data to child iframe.');
      });
    }
  }
}
