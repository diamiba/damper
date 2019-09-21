import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, fr_FR, NzFormModule, NzModalModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { SharedModule } from './shared/shared/shared.module';

registerLocaleData(fr);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        IconsProviderModule,
        NgZorroAntdModule,
        NzModalModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NzFormModule,
        SharedModule
    ],
    providers: [{ provide: NZ_I18N, useValue: fr_FR }, { provide: LOCALE_ID, useValue: 'fr' },],
    bootstrap: [AppComponent]
})
export class AppModule { }
