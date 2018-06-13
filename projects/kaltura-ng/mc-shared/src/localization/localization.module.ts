import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { AppLocalization } from './app-localization.service';
import { LocalizationPipe } from './localization.pipe';

@NgModule({
	imports: <any[]>[
		CommonModule,
		TranslateModule
	],
	declarations: <any[]>[
		LocalizationPipe
	],
	exports: <any[]>[
		LocalizationPipe
	],
	providers: <any[]>[
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
