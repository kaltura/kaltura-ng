import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';



@Injectable()
export class AppLocalization {

    private _selectedLanguage: string;

    public get selectedLanguage() : string
    {
        return this._selectedLanguage;
    }

    constructor(private translate: TranslateService) {
    }

    public setFilesHash(hash: string, prefix?: string) : void{
        if (this.translate.currentLoader instanceof TranslateHttpLoader)
        {
            // This is a dirty workaround until we upgrade to ngx-translate.
            if (prefix) {
	            (<any>this.translate.currentLoader).prefix = prefix;
            }

            (<any>this.translate.currentLoader).suffix = `.json?$v=${hash}`;
        }else {
            throw new Error('cannot assign translation files version');
        }
    }

    public load(language: string, fallbackLanguage? : string ) : Observable<void> {

        return Observable.create((observer : any) =>
        {
            if (fallbackLanguage && language !== fallbackLanguage) {
                this.translate.setDefaultLang(fallbackLanguage); // backup for missing translations
            }
            this._selectedLanguage = language;

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
        });
    }

    public get(query: string, interpolateParams?: Object): string {
        if (!query || query.length === 0) {
            return query;
        }

        return this.translate.instant(query, interpolateParams);
    }

};
