import { Component, OnInit } from '@angular/core';
import { UserSessionService } from './services/user-session.service';

@Component({
  selector: 'app-root',
  template: '<h1>Child App Loaded</h1>'
})
export class AppComponent implements OnInit {
  constructor(private sessionService: UserSessionService) {}

  ngOnInit() {
    // Step 1: Attach listener before sending handshake
    window.addEventListener('message', this.handleParentMessage.bind(this));

    // Step 2: Signal readiness to parent
    window.parent.postMessage({ type: 'child-ready' }, 'https://parent-app-domain.com');
  }

  handleParentMessage(event: MessageEvent) {
    if (event.origin !== 'https://parent-app-domain.com') return;

    if (event.data.type === 'auth-data') {
      const { token, userId, orgId } = event.data.payload;

      // Save to sessionStorage or inject into a service
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user_id', userId);
      sessionStorage.setItem('org_id', orgId);

      console.log('Child app received auth data and stored it.');
    }
  }
}