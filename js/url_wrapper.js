/*!
 *  @brief  urlWrapper
 *  @note   urlを扱いやすくしたもの
 */
class urlWrapper {

    constructor(url) {
        var href_div = (function() {
            const href_header = [
                'http://',
                'https://'
            ];
            for (const headar of href_header) {
                if (url.substr(0, headar.length) == headar) {
                    return url.substr(headar.length).split('/');
                }
            }
            return [];
        })();
        this.url = url;
        if (href_div.length > 0) {
            this.domain = href_div[0];
        } else {
            this.domain = '';
        }
        this.subdir = [];
        if (href_div.length > 1) {
            for (var i = 1; i < href_div.length; i++) {
                this.subdir.push(href_div[i]);
            }
        }
    }

    in_finance_yahoo() {
        return this.domain.indexOf("finance.yahoo.co.jp") >= 0;
    }
    in_info_finance_yahoo() {
        return this.domain.indexOf("info.finance.yahoo.co.jp") >= 0;
    }
    in_stock_finance_yahoo() {
        return this.domain.indexOf("stocks.finance.yahoo.co.jp") >= 0;
    }
    in_wikipedia() {
        return this.domain.indexOf("ja.wikipedia.org") >= 0;
    }

    in_this_kiji_is() {
        return this.domain.indexOf("nordot.app") >= 0;
    }
    in_afp() {
        return this.domain.indexOf("www.afpbb.com") >= 0;
    }

    in_fnn_news() {
        return this.domain.indexOf("www.fnn.jp") >= 0;
    }
    in_ntv_news() {
        return this.domain.indexOf("www.news24.jp") >= 0;
    }

    in_iwate_np() {
        return this.domain.indexOf("www.iwate-np") >= 0;
    }
    in_yamagata_np() {
        return this.domain.indexOf("www.yamagata-np.jp") >= 0;
    }
    in_kahoku() {
        return this.domain.indexOf("www.kahoku.co.jp") >= 0;
    }
    in_shimotsuke() {
        return this.domain.indexOf("www.shimotsuke.co.jp") >= 0;
    }
    in_chibanippo() {
        return this.domain.indexOf("www.chibanippo.co.jp") >= 0;
    }
    in_saitama_np() {
        return this.domain.indexOf("www.saitama-np.co.jp") >= 0;
    }
    in_tokyo_np() {
        return this.domain.indexOf("www.tokyo-np.co.jp") >= 0;
    }
    in_kanaloco() {
        return this.domain.indexOf("www.kanaloco.jp") >= 0
    }
    in_chunichi() {
        return this.domain.indexOf("www.chunichi.co.jp") >= 0;
    }
    in_kyoto_np() {
        return this.domain.indexOf("www.kyoto-np.co.jp") >= 0;
    }
    in_kobe_np() {
        return this.domain.indexOf("www.kobe-np.co.jp") >= 0;
    }
    in_tokushima_np() {
        return this.domain.indexOf("www.topics.or.jp") >= 0;
    }
    in_okinawatimes() {
        return this.domain.indexOf("www.okinawatimes.co.jp") >= 0;
    }

    in_bunshun() {
        return this.domain.indexOf("bunshun.jp") >= 0;
    }
    in_nikkan_gendai() {
        return this.domain.indexOf("www.nikkan-gendai.com") >= 0
    }
    in_sports_hochi() {
        return this.domain.indexOf("hochi.news") >= 0;
    }

    in_jcast() {
        return this.domain.indexOf("www.j-cast.com") >= 0;
    }
    in_nlab() {
        return this.domain.indexOf("nlab.itmedia.co.jp") >= 0;
    }

    in_4gamer() {
        return this.domain.indexOf("www.4gamer.net") >= 0;
    }
    in_togetter() {
        return this.domain.indexOf("togetter.com") >= 0;
    }
    in_google() {
        return this.domain == 'www.google.com';
    }    
    in_twitter() {
        return this.domain.indexOf("twitter.com") >= 0;
    }
    in_twitter_user_page() {
        if (!this.in_twitter() || this.in_twitter_search()) {
            return false;
        }
        if (this.subdir.length == 1) {
            return !this.is_illegal_tw_username(this.subdir[0]);
        } else if (this.subdir.length > 1) {
            return !this.is_illegal_tw_username(this.subdir[0]) &&
               (this.subdir[1] == '' || this.subdir[1] == 'media');
        } else {
            return false;
        }
    }
    in_twitter_list() {
        if (!this.in_twitter() || this.in_twitter_search()) {
            return false;
        }
        return this.subdir.length == 3 &&
               this.subdir[1] == 'lists' &&
               this.subdir[2] != '';
    }
    in_twitter_tw_thread() {
        if (!this.in_twitter() || this.in_twitter_search()) {
            return false;
        }
        if (this.subdir.length != 3) {
            return false;
        }
        if (this.is_illegal_tw_username(this.subdir[0])) {
            return false;
        }
        return this.subdir[1] == 'status';
    }
    in_twitter_search() {
        return this.in_twitter() &&
               this.subdir.length > 0 &&
               (this.subdir[0] == 'hashtag' ||
                this.subdir[0].search((RegExp("^search\?", ""))) >= 0);
    }

    is_illegal_tw_username(username) {
        return username == 'i' ||       // momentで使用
               username == 'hashtag';   // hashtag検索で使用
    }    
}
