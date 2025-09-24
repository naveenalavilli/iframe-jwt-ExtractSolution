
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private token = '';
  private userId = '';
  private orgId = '';

  set(token: string, userId: string, orgId: string) {
    this.token = token;
    this.userId = userId;
    this.orgId = orgId;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getOrgId() {
    return this.orgId;
  }
}
