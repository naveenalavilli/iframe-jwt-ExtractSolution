
import { Component, OnInit } from '@angular/core';
import { UserSessionService } from './services/user-session.service';

@Component({
  selector: 'app-root',
  template: '<h1>Child App Loaded</h1>'
})
export class AppComponent implements OnInit {
  constructor(private sessionService: UserSessionService) {}

  ngOnInit() {
    window.addEventListener('message', this.handleParentMessage.bind(this));
    window.parent.postMessage({ type: 'child-ready' }, 'https://parent-app-domain.com');
  }

  handleParentMessage(event: MessageEvent) {
    if (event.origin !== 'https://parent-app-domain.com') return;
    if (event.data.type === 'auth-data') {
      const { token, userId, orgId } = event.data.payload;
      this.sessionService.set(token, userId, orgId);
    }
  }
}
