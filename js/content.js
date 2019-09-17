/*!
 *  @brief  content.js本体
 */
class Content {

    constructor() {
        this.blocker = new PrivateAdblocker();
        this.current_location = new urlWrapper(location.href);
        this.kick();
    }

    kick() {
        this.blocker.load();
    }
}

/*!
 *  @brief  PrivateAdblocker
 */
class PrivateAdblocker {

    constructor() {
        this.after_domloaded_observer = null;
        this.filtering_timer = null;
        //
        this.initialize();
    }

    load() {
        document.addEventListener("DOMContentLoaded", ()=> {
            this.filtering();
            //
            const loc = gContent.current_location;
            if (!this.ready_element_observer(loc)) {
                // DOM構築完了時点でキーelementが見つからない場合は
                // intervalTimerで生成を待ってobserver登録する
                this.observer_timer = setInterval(()=> {
                    if (this.ready_element_observer(loc)) {
                        clearInterval(this.observer_timer);
                        this.observer_timer = null;
                    }
                }, 33); /* 1/30sec */
            }
        });
    }

    /*!
     *  @brief  element追加observer準備
     *  @param  loc     現在地(URL)
     *  @note   DOM構築完了後に追加される遅延elementもフィルタにかけたい
     *  @note   → observerでelement追加をhookしfiltering実行
     */
    ready_element_observer(loc) {
        var elem = [];
        if (loc.in_finance_yahoo()) {
            elem = $("div#contents");
        } else if (loc.in_this_kiji_is()) {
            elem = $("div.page__contentsWrapper");
        } else if (loc.in_afp()) {
            elem = $("main.main");
        } else if (loc.in_fnn_news()) {
            elem = $("main.PageGrid");
        } else if (loc.in_ntv_news()    ||
                   loc.in_chibanippo()) {
            elem = $("div#main");
        } else if (loc.in_wikipedia()   ||
                   loc.in_yamagata_np()) {
            elem = $("div#content");
        } else if (loc.in_kahoku()) {
            elem = $("div#container");
        } else if (loc.in_shimotsuke()  ||
                   loc.in_tokushima_np()) {
            elem = $("div#main-column");
        } else if (loc.in_saitama_np()) {
            elem = $("div#wrapper");
        } else if (loc.in_kanaloco()) {
            elem = $("main#contents");
        } else if (loc.in_tokyo_np()    ||
                   loc.in_chunichi()) {
            elem = $("td#Contents");
        } else if (loc.in_kyoto_np()) {
            elem = $("div#Container");
        } else if (loc.in_kobe_np()) {
            elem = $("div.contents");
        } else if (loc.in_okinawatimes()) {
            elem = $("main.l-main");
        } else  if (loc.in_bunshun()) {
            elem = $("main.main-column");
        } else if (loc.in_nikkan_gendai()) {
            elem = $("main#main.main-contents");
        } else if (loc.in_sports_hochi()) {
            elem = $("div.conteiner-right");
        } else if (loc.in_jcast()) {
            elem = $("div.column-main");
        } else if (loc.in_nlab()) {
            elem = $("div#masterMain");
        } else if (loc.in_togetter()) {
            elem = $("div.contents_main");
        } else if (loc.in_4gamer()) {
            elem = $("body")
        } else {
            // 遅延filtering不要
            return true;
        }
        for (var e of elem) {
            this.after_domloaded_observer.observe(e, {
                childList: true,
                subtree: true,
            });
        }
        return elem.length > 0;
    }

    /*!
     *  @brief  フィルタリング
     *  @note   DOM構築完了タイミング（またはelement追加時）に実行
     */
    filtering() {
        const loc = gContent.current_location;
        if (loc.in_finance_yahoo()) {
            // finance系の画面右上に出る割り込み広告(ドリームメール類)
            this.detach_element("div#pos-lrec");
            // finance系画面下部に出るPR広告
            this.detach_element("div.ultra.marB10");
        } else if (loc.in_wikipedia()) {
            this.detach_element("div#frb-main");
            this.detach_element("div#frb-inline");
            this.detach_element("div#frb-nag");
            this.detach_element("div.frb.frb-nag.frb-rml-enabled");
        } else if (loc.in_this_kiji_is()    ||
                   loc.in_afp()             ||
                   loc.in_fnn_news()        ||
                   loc.in_shimotsuke()      ||
                   loc.in_tokyo_np()        ||
                   loc.in_chunichi()        ||
                   loc.in_kobe_np()         ||
                   loc.in_sports_hochi()    ||
                   loc.in_jcast()           ||
                   loc.in_togetter()) {
            this.filtering_popin_ad();
        } else if (loc.in_ntv_news()) {
            this.filtering_ntv_news_pr();
            this.filtering_popin_ad();
        } else if (loc.in_iwate_np()) {
            this.filtering_uzou_ad();
        } else if (loc.in_yamagata_np()) {
            this.filtering_popin_ad();
            this.filtering_uzou_iframe_ad("pr-yamagata-np");
        } else if (loc.in_kahoku()) {
            this.filtering_popin_ad();
            this.filtering_uzou_iframe_ad("kahoku");
        } else if (loc.in_chibanippo()) {
            this.filtering_xlift_ad();
        } else if (loc.in_saitama_np()) {
            this.filtering_saitama_np_pr();
            this.filtering_outbrain_ad();
            this.filtering_uzou_ad();
        } else if (loc.in_kanaloco()) {
            this.filtering_kanaloco_pr();
            this.filtering_outbrain_ad();
            this.filtering_uzou_ad();
            this.filtering_xlift_ad();
        } else if (loc.in_kyoto_np()) {
            this.filtering_kyoto_np_pr();
            this.filtering_uzou_iframe_ad("rec-kyoto-np");
        } else if (loc.in_tokushima_np()) {
            this.filtering_popin_ad();
            this.filtering_uzou_iframe_ad("topics-or");
        } else if (loc.in_okinawatimes()) {
            this.filtering_uzou_iframe_ad("okinawatimes");
        } else if (loc.in_nikkan_gendai()) {
            this.filtering_nikkan_gendai_pr();
            this.filtering_popin_ad();
        } else if (loc.in_bunshun()) {
            this.filtering_bunshun_pr();
            this.filtering_uzou_ad();
        } else if (loc.in_nlab()) {
            this.filtering_nlab_pr();
            this.filtering_popin_ad();
        } else if (loc.in_4gamer()) {
            this.filtering_4gamer_pr();
        }
    }

    filtering_popin_ad() {
        $("div._popIn_recommend_articles").each((inx, elem)=> {
            $(elem).find("div._popIn_recommend_article").each((inx, article)=> {
                if (article.className.indexOf("_article_ad") >= 0) {
                    $(article).detach();
                }
            });
            $(elem).find("a._popIn_recommend_article").each((inx, article)=> {
                if (article.className.indexOf("_article_ad") >= 0) {
                    $(article).find("div").each((inx, dv)=> {
                        $(dv).detach();
                    });
                }
            });
        });
    }

    filtering_outbrain_ad() {
        // AdBlockplusで消えるので通常は対処不要
        // AdBlockplusを無効にせざるを得ないサイト用
        $("ul.ob-widget-items-container").each((inx, elem)=> {
            $(elem).find("li.ob-dynamic-rec-container").each((inx, e_li)=> {
                if ($(e_li).find("span.ob-rec-label").length > 0) {
                    $(e_li).detach();
                } else {
                    const src = $(e_li).find("span.ob-unit.ob-rec-source");
                    if (src.length > 0) {
                        var property = window.getComputedStyle($(src[0])[0], '::before').getPropertyValue('content');
                        if (property.indexOf("(PR)") >= 0) {
                            $(e_li).detach();
                        }
                    }
                }
            });
        });
    }

    filtering_uzou_ad() {
        $("div.__uz__articles-area").each((inx, elem)=> {
            $(elem).find("div").each((inx, article)=> {
                if (article.className.indexOf("ad_response") >= 0) {
                    $(article).detach();
                }
            });
        });
    }
    filtering_uzou_iframe_ad(key) {
        // 別frame作ってる関係上個別記事の削除ができそうにない
        //  1. iframe -> document -> findで目的のdivが取れない(生成済みなのにchildにない)
        //  2. documentのload完了を待ち、コールバック内でdocumentを得ようとしたらcross-origin frameエラー
        // → まるごと消す
        const tag0 = 'div#uz-' + key + '_pc-0.uz-' + key + '_pc.uz-ar';
        const tag1 = 'div#uz-' + key + '_pc-1.uz-' + key + '_pc.uz-ar';
        this.detach_element(tag0);
        this.detach_element(tag1);
    }

    filtering_xlift_ad() {
        $("ul.x1_article").each((inx, elem)=> {
            $(elem).find("li").each((inx, article)=> {
                if (article.className.indexOf("x1_ad") >= 0) {
                    $(article).detach();
                }
            });
        });
        $("ul.x2_article").each((inx, elem)=> {
            $(elem).find("li").each((inx, article)=> {
                if (article.className.indexOf("x2_ad") >= 0) {
                    $(article).detach();
                }
            });
        });
    }

    filtering_ntv_news_pr() {
        // 関連記事がまるごと消えてしまうのでAdBlockplus無効化
        // → 個別に消す
        $("div#main").each((inx, elem)=> {
            this.detach_child_element(elem, "div#adText01");
            this.detach_child_element(elem, "div#adText02");
            this.detach_child_element(elem, "div#rectBanner");
        });
        $("div#sub").each((inx, elem)=> {
            $(elem).find("a").each((inx, alink)=> {
                if ($(alink).attr("href").indexOf("banner") >= 0) {
                    $(alink).detach();
                }
            });
            this.detach_child_element(elem, "div#bigSkyscraperBanner");
            this.detach_child_element(elem, "div#sideRectBanner");
        });
    }

    filtering_saitama_np_pr() {
        // 記事自体が消えてしまうのでAdBlockplus無効化
        // →個別に消す
        $("div#pagehead").each((inx, elem)=> {
            this.detach_child_element(elem, "div#ad_top");
        });
        $("div#misc_side").each((inx, elem)=> {
            for (const e_ch of elem.children) {
                const id = $(e_ch).attr("id");
                if (id != null && id.indexOf("div-gpt-ad") >= 0) {
                    $(e_ch).detach();
                }
            }
            $(elem).find("iframe").each((inx, e_ifm)=> {
                const id = $(e_ifm).attr("id");
                if (id != null && id.indexOf("yads_") >= 0) {
                    $(e_ifm).parent().detach();
                }
            });
        });
        $("div#page_main").each((inx, elem)=> {
            this.detach_child_element(elem, "div#ad_middle");
            this.detach_child_element(elem, "div#ad_bottom");
        });
    }

    filtering_kanaloco_pr() {
        // 検索結果が消えてしまうのでAdBlockplus無効化
        // →個別に消す
        this.detach_element("div.top-head-bnr");
        this.detach_element("div.blk-bnr01.section02");
        this.detach_element("div.blk-bnr02");
    }
    
    filtering_kyoto_np_pr() {
        // 独自バナーが消えない
        $("div#Ad").each((inx, elem)=> {
            this.detach_child_element(elem, "div.BnrLnkSbs");
        });
    }

    filtering_nikkan_gendai_pr() {
        $("div.right-menu").each((inx, elem)=> {
            this.detach_child_element(elem, "div.ad-box");
            this.detach_child_element(elem, "div.osusume-ranking.lanking-box");
            $(elem).find("div.infeed").each((inx, e_inf)=> {
                if ($(e_inf).find("div#_popIn_infeed").length > 0) {
                    $(e_inf).detach();
                }
            });
        });
    }

    filtering_bunshun_pr() {
        $("div.block.recommend-articles").each((inx, elem)=> {
            $(elem).find("div.title").each((inx, title)=> {
                const title_ad = $(title).find("div.logly-lift-ad-adv");
                if (title_ad.length > 0) {
                    $(title).parent().detach();
                }
            });
        });
        $("ul.list-thumb").each((inx, elem)=> {
            $(elem).find("li").each((inx, e_li)=> {
                if ($(e_li).find("span.list-item.pr").length > 0) {
                    $(e_li).detach();
                }
            });
        });
    }

    filtering_nlab_pr() {
        $("div#masterSub").each((inx, elem)=> {
            this.detach_child_element(elem, "div#colBoxPrArticle");
            this.detach_child_element(elem, "div#colBoxKodanshaManga");
        });
    }

    filtering_4gamer_pr() {
        this.detach_element("dl#NOTIFY_EVENT");
        $("div.right_contents").each((inx, elem)=> {
            this.detach_child_element(elem, "div.sidetop");
            this.detach_child_element(elem, "div.topics");
            this.detach_child_element(elem, "div.skyscraper");
            this.detach_child_element(elem, "div.paidpub_special");
        });
    }

    /*!
     *  @brief  任意の要素をdetachする
     *  @param  identifier  要素識別子
     */
    detach_element(identifier) {
        $(identifier).each((inx, elem)=> {
            $(elem).detach();
        });
    }
    /*!
     *  @brief  任意の子要素をdetachする
     *  @param  parent      親要素
     *  @param  identifier  要素識別子
     */
    detach_child_element(parent, identifier) {
        $(parent).find(identifier).each((inx, elem)=> {
            $(elem).detach();
        });
    }

    /*
     */
    initialize() {
        // DOM構築完了後のノード追加observer
        this.after_domloaded_observer = new MutationObserver((records)=> {
            // 短時間の連続追加はまとめて処理したい気持ち
            if (null == this.filtering_timer) {
                this.filtering_timer = setTimeout(()=> {
                    gContent.current_location = new urlWrapper(location.href);
                    this.filtering();
                    clearTimeout(this.filtering_timer);
                    this.filtering_timer = null;
                }, 200); // 200ms
            }
        });
    }
}

var gContent = new Content();
