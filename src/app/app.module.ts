import { HttpClientModule, HttpBackend, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OktaAuthModule, OktaAuthConfigService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { tap, take } from 'rxjs';

// const oktaAuth = new OktaAuth({
//   issuer: 'https://dev-11264579.okta.com/oauth2/default',
//   clientId: '0oabapji4aOpJGQPE5d7',
//   redirectUri: window.location.origin + '/login/callback',
// });


function configInitializer(httpBackend: HttpBackend, configService: OktaAuthConfigService): () => void {
  return () =>
  new HttpClient(httpBackend)
  .get('api/config.json') // this is from okta-angular-async-config-example repo's Express server
  .pipe(
    tap((authConfig: any) => configService.setConfig({oktaAuth: new OktaAuth({...authConfig, redirectUri: `${window.location.origin}/login/callback`})})),
    take(1)
  );
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OktaAuthModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configInitializer, deps: [HttpBackend, OktaAuthConfigService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
