import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from 'ng2-translate/ng2-translate';
import * as R from 'ramda';

import { AppStorage } from '../app-storage.service';



@Injectable()
export class AppLocalization {
    public supportedLocales: any[] = [];
    selectedLanguage = "en";

    constructor(private translate: TranslateService, private appStorage: AppStorage) {
    }


    public load() : Observable<boolean> {

        return Observable.create((observer : any) =>
        {
            if (this.supportedLocales.length) {
                this.translate.setDefaultLang('en'); // backup for missing translations
                this.selectedLanguage = this.getCurrentLanguage(this.translate.getBrowserLang());
                this.translate.use(this.selectedLanguage).subscribe(
                    () => {
                        // using a timeout due to observables race condiftion on ng20translate. Should be revised if possible.
                        setTimeout(function(){
                            observer.next(true);
                            observer.complete();
                        },0);
                    },
                    () => {
                        Observable.throw(new Error("Loading localization file failed. Language = " + this.selectedLanguage));
                    }
                );
            }else{
                // no locales were specified, localization disabled
                observer.next(false);
                observer.complete();
            }
        });
    }

    private getCurrentLanguage(browserLang: string): string{
        let lang: string = null;
        // try getting last selected language from local storage
        if (this.appStorage.getFromLocalStorage('kmc_lang') !== null) {
            let storedLanguage: string = this.appStorage.getFromLocalStorage('kmc_lang');
            if (this.getLanguageById(storedLanguage) !== undefined) {
                lang = storedLanguage;
            }
        }

        // if wasn't found in local storage, try getting from browser language settings
        if ( lang === null && this.getLanguageById(browserLang) !== undefined ) {
            lang = browserLang;
        }
        return lang === null ? "en" : lang;
    }

    private getLanguageById(langId : any) : any {
        return R.find(R.propEq('id', langId))(this.supportedLocales);
    }

    public get(query: string, interpolateParams?: Object): string {
        if (!query || query.length === 0) {
            return query;
        }

        return this.translate.instant(query, interpolateParams);
    }

};
