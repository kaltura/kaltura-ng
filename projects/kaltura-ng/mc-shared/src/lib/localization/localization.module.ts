import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppLocalization } from './app-localization.service';
import { LocalizationPipe } from './localization.pipe';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [
		LocalizationPipe
	],
	exports: [
		LocalizationPipe
	],
	providers: [
	]
})
export class LocalizationModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: LocalizationModule,
			providers: [
				AppLocalization
			]
		};
	}
}
