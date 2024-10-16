import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: 
  [ provideRouter(routes), 
    provideHttpClient(withFetch()),
    importProvidersFrom(HttpClientModule), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
