import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BayComponent } from './bay/bay.component';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LibraryComponent } from './library/library.component';

@NgModule({ declarations: [
        AppComponent,
        BayComponent,
        LibraryComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule],
         providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
