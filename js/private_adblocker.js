/*!
 *  @brief  PrivateAdblocker
 */
class PrivateAdblocker {

    /*!
     *  @brief  フィルタリング
     *  @note   DOM構築完了タイミング（またはelement追加時）に実行
     */
    filtering() {
        const loc = this.current_location;
        if (loc.in_finance_yahoo()) {
            // finance系の画面右上に出る割り込み広告(ドリームメール類)
            HTMLUtil.detach_element("div#pos-lrec");
            // finance系画面下部に出るPR広告
            HTMLUtil.detach_element("div.ultra.marB10");
        } else if (loc.in_wikipedia()) {
            HTMLUtil.detach_element("div#frb-main");
            HTMLUtil.detach_element("div#frb-inline");
            HTMLUtil.detach_element("div#frb-nag");
            HTMLUtil.detach_element("div.frb.frb-nag.frb-rml-enabled");
        } else if (loc.in_afp() ||
            loc.in_fnn_news() ||
            loc.in_shimotsuke() ||
            loc.in_tokyo_np() ||
            loc.in_chunichi() ||
            loc.in_kobe_np() ||
            loc.in_sports_hochi() ||
            loc.in_jcast() ||
            loc.in_togetter()) {
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_ntv_news()) {
            FilterUtil.filtering_ntv_news_pr();
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_this_kiji_is()) {
            FilterUtil.filtering_this_kiji_is();
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_iwate_np()) {
            FilterUtil.filtering_uzou_ad();
        } else if (loc.in_yamagata_np()) {
            FilterUtil.filtering_popin_ad();
            FilterUtil.filtering_uzou_iframe_ad("pr-yamagata-np");
        } else if (loc.in_kahoku()) {
            FilterUtil.filtering_popin_ad();
            FilterUtil.filtering_uzou_iframe_ad("kahoku");
        } else if (loc.in_chibanippo()) {
            FilterUtil.filtering_xlift_ad();
        } else if (loc.in_saitama_np()) {
            FilterUtil.filtering_saitama_np_pr();
            FilterUtil.filtering_outbrain_ad();
            FilterUtil.filtering_uzou_ad();
            FilterUtil.filtering_popin_ad();
            FilterUtil.filtering_cws_ad();
        } else if (loc.in_kanaloco()) {
            FilterUtil.filtering_kanaloco_pr();
            FilterUtil.filtering_outbrain_ad();
            FilterUtil.filtering_uzou_ad();
            FilterUtil.filtering_xlift_ad();
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_kyoto_np()) {
            FilterUtil.filtering_kyoto_np_pr();
            FilterUtil.filtering_uzou_iframe_ad("rec-kyoto-np");
        } else if (loc.in_tokushima_np()) {
            FilterUtil.filtering_popin_ad();
            FilterUtil.filtering_uzou_iframe_ad("topics-or");
        } else if (loc.in_okinawatimes()) {
            FilterUtil.filtering_uzou_iframe_ad("okinawatimes");
        } else if (loc.in_nikkan_gendai()) {
            FilterUtil.filtering_nikkan_gendai_pr();
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_bunshun()) {
            FilterUtil.filtering_bunshun_pr();
            FilterUtil.filtering_uzou_ad();
        } else if (loc.in_nlab()) {
            FilterUtil.filtering_nlab_pr();
            FilterUtil.filtering_popin_ad();
        } else if (loc.in_4gamer()) {
            FilterUtil.filtering_4gamer_pr();
        } else if (loc.in_twitter()) {
            FilterUtil.filtering_twitter_pr(loc.in_twitter_tw_thread());
        }
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
            elem = $("div.main__content");
        } else if (loc.in_afp()) {
            elem = $("main.main");
        } else if (loc.in_fnn_news()) {
            elem = $("main.PageGrid");
        } else if (loc.in_ntv_news() ||
            loc.in_chibanippo()) {
            elem = $("div#main");
        } else if (loc.in_wikipedia() ||
            loc.in_yamagata_np()) {
            elem = $("div#content");
        } else if (loc.in_kahoku()) {
            elem = $("div#container");
        } else if (loc.in_shimotsuke() ||
            loc.in_tokushima_np()) {
            elem = $("div#main-column");
        } else if (loc.in_saitama_np()) {
            elem = $("div#wrapper");
        } else if (loc.in_kanaloco()) {
            elem = $("main#contents");
        } else if (loc.in_tokyo_np() ||
            loc.in_chunichi()) {
            elem = $("td#Contents");
        } else if (loc.in_kyoto_np()) {
            elem = $("div#Container");
        } else if (loc.in_kobe_np()) {
            elem = $("div.contents");
        } else if (loc.in_okinawatimes()) {
            elem = $("main.l-main");
        } else if (loc.in_bunshun()) {
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
            elem = $("body");
        } else if (loc.in_twitter()) {
            elem = $("div#react-root");
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

    /*
     */
    initialize() {
        document.addEventListener("DOMContentLoaded", () => {
            this.filtering();
            //
            const loc = this.current_location;
            if (!this.ready_element_observer(loc)) {
                // DOM構築完了時点でキーelementが見つからない場合は
                // intervalTimerで生成を待ってobserver登録する
                this.observer_timer = setInterval(() => {
                    if (this.ready_element_observer(loc)) {
                        clearInterval(this.observer_timer);
                        this.observer_timer = null;
                    }
                }, 33); /* 1/30sec */
            }
        });
        // DOM構築完了後のノード追加observer
        this.after_domloaded_observer = new MutationObserver((records) => {
            // 短時間の連続追加はまとめて処理したい気持ち
            if (null == this.filtering_timer) {
                this.filtering_timer = setTimeout(() => {
                    this.filtering();
                    clearTimeout(this.filtering_timer);
                    this.filtering_timer = null;
                }, 200); // 200ms
            }
        });
    }

    constructor(loc) {
        this.current_location = loc;
        this.after_domloaded_observer = null;
        this.filtering_timer = null;
        //
        this.initialize();
    }
}
