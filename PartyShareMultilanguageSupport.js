/*
 * Copyright 2014 Sony Corporation
 */
/* Lookup Table for langauge code with countries*/
var languageLookup = {
    'en': 'language/en_US.js', //en-ca,en-us is redirected to en "English(US)"
    'en-ie': 'language/en_US.js',
    'en-gb': 'language/en_GB.js',
    'fr-ca': 'language/fr_CA.js',
    'es-ar': 'language/en_US.js',
    'es-bo': 'language/es_ES.js',
    'es-cl': 'language/es_ES.js',
    'es-co': 'language/es_ES.js',
    'es-cr': 'language/es_ES.js',
    'es-ec': 'language/es_ES.js',
    'es-gt': 'language/es_ES.js',
    'es-hn': 'language/es_ES.js',
    'es-sv': 'language/es_ES.js',
    'es-mx': 'language/es_ES.js',
    'es-ni': 'language/es_ES.js',
    'es-pa': 'language/es_ES.js',
    'es-py': 'language/es_ES.js',
    'es-pe': 'language/es_ES.js',
    'es-pr': 'language/es_ES.js',
    'es-do': 'language/es_ES.js',
    'es-uy': 'language/es_ES.js',
    'es-ve': 'language/es_ES.js',
    'pt-br': 'language/pt_BR.js',
    'bs': 'language/bs_BA.js',
    'bg': 'language/bg_BG.js',
    'ca': 'language/ca_ES.js',
    'hr': 'language/hr_HR.js',
    'cs': 'language/cs_CZ.js',
    'da': 'language/da_DK.js',
    'nl': 'language/nl_NL.js',
    'et': 'language/et_EE.js',
    'fi': 'language/fi_FI.js',
    'fr': 'language/fr_FR.js', //fr-fr,fr-be,fr-lu,fr-ch is redirected to fr "French (AEP/GA)"
    'de': 'language/de_DE.js',
    'el': 'language/el_GR.js',
    'he': 'language/iw_IL.js',
    'hu': 'language/hu_HU.js',
    'it': 'language/it_IT.js',
    'kk': 'language/kk_KZ.js',
    'lv': 'language/lv_LV.js',
    'lt': 'language/lt_LT.js',
    'mk': 'language/mk_MK.js',
    'nb': 'language/nb_NO.js',
    'nn': 'language/nb_NO.js',
    'pl': 'language/pl_PL.js',
    'pt': 'language/pt_PT.js',
    'ro': 'language/ro_RO.js',
    'ru': 'language/ru_RU.js',
    'sr': 'language/sr_RS.js',
    'sk': 'language/sk_SK.js',
    'sl': 'language/sl_SI.js',
    'es': 'language/es_ES.js', //en-es is redirected to es "Spanish (AEP)"
    'sv': 'language/sv_SE.js',
    'tr': 'language/tr_TR.js',
    'uk': 'language/uk_UA.js',
    'en-au': 'language/en_US.js',
    'en-nz': 'language/en_US.js',
    'en-za': 'language/en_US.js',
    'en-in': 'language/en_US.js',
    'en-HK': 'language/en_US.js',
    'en-PH': 'language/en_US.js',
    'en-Sg': 'language/en_US.js',
    'zh': 'language/zh_CN.js', //zh-cn,zh-sg is redirected to zh "Chinese (Simplified)"
    'zh-hk': 'language/zh_CN.js',
    'zh-tw': 'language/zh_TW.js',
    'af': 'language/af_ZA.js',
    'ar': 'language/ar_EG.js',
    'id': 'language/in_ID.js',
    'fa': 'language/fa_IR.js',
    'sw': 'language/sw_TZ.js',
    'th': 'language/th_TH.js',
    'vi': 'language/vi_VN.js',
    'zu': 'language/zu_ZA.js',
    'as': 'language/as_IN.js',
    'bn': 'language/bn_IN.js',
    'gu': 'language/gu_IN.js',
    'hi': 'language/hi_IN.js',
    'kn': 'language/kn_IN.js',
    'ml': 'language/ml_IN.js',
    'mr': 'language/mr_IN.js',
    'or': 'language/or_IN.js',
    'pa': 'language/pa_IN.js',
    'ta': 'language/ta_IN.js',
    'te': 'language/te_IN.js',
    'ja': 'language/ja_JP.js'
};

/* function to check launguage preference of the mobile functionality */
function getLaunguageCode() {
    var Langcode = window.navigator.userLanguage || window.navigator.language;
    /*loadScript('language/ja_JP.js', changeTextcontent);*/
    if (typeof Langcode === 'string') {
        if (Langcode.length === 0) {
            loadScript('language/en_US.js', changeTextcontent);
        }
        splitName = Langcode.toLowerCase().match('^([a-z]+)(-[a-z1-9]+)?$');
        if (splitName) {
            if (languageLookup[splitName[0]] != undefined) {
                loadScript(languageLookup[splitName[0]], changeTextcontent);
            } else if (languageLookup[splitName[1]] != undefined) {
                loadScript(languageLookup[splitName[1]], changeTextcontent);
            } else {
                loadScript('language/en_US.js', changeTextcontent);
            }
        }
    } else if (Langcode == null) {
        loadScript('language/en_US.js', changeTextcontent);
    }

}

/* function to handle loading the traslated script js file */
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);

}

/* function to change the content of the webpage*/
function changeTextcontent() {
    var langElems = $('[langcode]');
    var langElemslength = langElems.length;
    for (var i = 0; i < langElemslength; i++) {
        var elem = langElems[i];
        var langElem = $(elem);
        if (langElem.is('input')) {
            if (langElem.attr('type') == 'text' || langElem.attr('type') == 'button') {
                if(langElem.attr('langcode') ==='64296'
                    || langElem.attr('langcode') ==='64307'
                    || langElem.attr('langcode') ==='64343'
                    || langElem.attr('langcode') ==='64352'
                    || langElem.attr('langcode') ==='64537'){
                    langElem.val(translationlist[langElem.attr('langcode')].replace("[%1]", translationlist['80409']));
                } else{
                    langElem.val(translationlist[langElem.attr('langcode')]);
                }
            }
        } else {
                if(langElem.attr('langcode') ==='64296'
                    || langElem.attr('langcode') ==='64307'
                    || langElem.attr('langcode') ==='64343'
                    || langElem.attr('langcode') ==='64352'
                    || langElem.attr('langcode') ==='64537' ){
                    langElem.html(translationlist[langElem.attr('langcode')].replace("[%1]", translationlist['80409']));
                } else if(langElem.attr('langcode') ==='64363'){
                    if(isLinux){
                        langElem.html(translationlist['81023']);
                    } else {
                        langElem.html(translationlist['64363']);
                    }
                } else if(langElem.attr('langcode') ==='80397'){
                    if(isLinux){
                        langElem.html(translationlist['51747']);
                    } else {
                        langElem.html(translationlist['80397']);
                    }
                } else{
                    langElem.html(translationlist[langElem.attr('langcode')]);
                }
        }
    }
}