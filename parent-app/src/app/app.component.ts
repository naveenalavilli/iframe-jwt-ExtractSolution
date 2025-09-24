
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const userId = 'user123';
    const orgId = 'org456';

    this.http.post<any>('https://parent-api.com/api/relaytoken/get-child-token', {
      userId,
      orgId
    }).subscribe(res => {
      const iframe = document.getElementById('child-frame') as HTMLIFrameElement;
      const message = {
        type: 'auth-data',
        payload: {
          token: res.token,
          userId,
          orgId
        }
      };
      iframe.onload = () => {
        iframe.contentWindow?.postMessage(message, 'https://child-app-domain.com');
      };
    });
  }
}
