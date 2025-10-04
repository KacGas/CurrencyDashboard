import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CurrencyTable } from './components/currency-table/currency-table';
import { CurrencyChart } from './currency-chart/currency-chart';

@NgModule({
  declarations: [
    App,
    CurrencyTable
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CurrencyChart
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
