import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the EigonicTranslatorPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'translate',
})
export class Translator implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
   private static langBundle: any[];
   public static currentLang: string;
   public static fallbackLang: string;
   static init(langBundle: any[], fallbackLang: string, currentLang?: string) {
       Translator.langBundle = langBundle;
       Translator.currentLang = currentLang;
       Translator.fallbackLang = fallbackLang;
   }

   static switchLang(lang: string) {
       Translator.currentLang = lang;
   }

   static transform2(value: string): string {
     // If there is no selected language, use the default.
     if (Translator.currentLang === null || Translator.currentLang === undefined)
       Translator.currentLang = Translator.fallbackLang;
     // get the translation from the language bundle
     let transVal = Translator.langBundle[Translator.currentLang][value];
     // if there is no translation, then return the orignal keyword
     if (transVal === null || transVal === undefined)
       transVal = value;
     return transVal;
   }

   transform(value: string): string {
       // If there is no selected language, use the default.
       if (Translator.currentLang === null || Translator.currentLang === undefined)
           Translator.currentLang = Translator.fallbackLang;
           // get the translation from the language bundle
       let transVal = Translator.langBundle[Translator.currentLang][value];
       // if there is no translation, then return the orignal keyword
       if (transVal === null || transVal === undefined)
           transVal = value;
       return transVal;
   }


}
/*
import {Pipe} from '@angular/core';

export module eigonic {

    @Pipe({ name: 'translate' })
    export class Translator {
        private static langBundle: any[];
        public static currentLang: string;
        public static fallbackLang: string;
        static init(langBundle: any[], fallbackLang: string, currentLang?: string) {
            Translator.langBundle = langBundle;
            Translator.currentLang = currentLang;
            Translator.fallbackLang = fallbackLang;
        }

        static switchLang(lang: string) {
            Translator.currentLang = lang;
        }

        transform(value: string): string {
        		// If there is no selected language, use the default.
            if (Translator.currentLang === null || Translator.currentLang === undefined)
                Translator.currentLang = Translator.fallbackLang;
                // get the translation from the language bundle
            let transVal = Translator.langBundle[Translator.currentLang][value];
            // if there is no translation, then return the orignal keyword
            if (transVal === null || transVal === undefined)
                transVal = value;
            return transVal;
        }

    }
}
*/
