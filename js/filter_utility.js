/*!
 *  @brief  フィルター関数群
 */
class FilterUtil {

    static filtering_popin_ad() {
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

    static filtering_outbrain_ad() {
        // AdBlockplusを無効にせざるを得ないサイト用
        // AdBlockplusで消えるので通常は対処不要
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

    static filtering_uzou_ad() {
        $("div.__uz__articles-area").each((inx, elem)=> {
            $(elem).find("div").each((inx, article)=> {
                if (article.className.indexOf("ad_response") >= 0) {
                    $(article).detach();
                }
            });
        });
    }
    static filtering_uzou_iframe_ad(key) {
        // 別frame作ってる関係上個別記事の削除ができそうにない
        //  1. iframe -> document -> findで目的のdivが取れない(生成済みなのにchildにない)
        //  2. documentのload完了を待ち、コールバック内でdocumentを得ようとしたらcross-origin frameエラー
        // → まるごと消す
        const tag0 = 'div#uz-' + key + '_pc-0.uz-' + key + '_pc.uz-ar';
        const tag1 = 'div#uz-' + key + '_pc-1.uz-' + key + '_pc.uz-ar';
        HTMLUtil.detach_element(tag0);
        HTMLUtil.detach_element(tag1);
    }

    static filtering_xlift_ad() {
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

    /*!
     *  @note   client.contents-search-windows.comから提供される記事群
     *  @note   どこの会社が提供してるか不明(ドメインは"お名前.com"管理)
     *  @note   saitama-npで採用されている
     */
    static filtering_cws_ad() {
        $("div.csw-content-container").each((inx, cont)=> {
            $(cont).find("div.csw-content-box").each((inx, box)=> {
                if (box.className.indexOf(" ise-ad") >= 0) {
                    $(box).detach();
                }
            });
        });
    }


    static filtering_ntv_news_pr() {
        // 関連記事がまるごと消えてしまうのでAdBlockplus無効化
        // → 個別に消す
        $("div#header").each((inx, elem)=>{
            HTMLUtil.detach_child_element(elem, "div#largeBanner");
        });
        $("div#main").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div#adText01");
            HTMLUtil.detach_child_element(elem, "div#adText02");
            HTMLUtil.detach_child_element(elem, "div#rectBanner");
            $("div#newsDetail").each((inx, det)=> {
                HTMLUtil.detach_child_element(det, "div#regularBanner");
            });
        });
        $("div#sub").each((inx, elem)=> {
            $(elem).find("a").each((inx, alink)=> {
                if ($(alink).attr("href").indexOf("banner") >= 0) {
                    $(alink).detach();
                }
            });
            HTMLUtil.detach_child_element(elem, "div#bigSkyscraperBanner");
            HTMLUtil.detach_child_element(elem, "div#sideRectBanner");
        });
    }

    static filtering_this_kiji_is() {
        // blocker検知(Admiral)
        // → 個別に消す
        const adspace = "div.page__contentsWrapper.page__contentsWrapper--ur";
        // 記事とrecommendの間に出るg-ads
        HTMLUtil.detach_element(adspace);
        // 記事右に出るg-ads
        HTMLUtil.detach_element("div.main__rightbar");
        // 記事内g-ads
        $("div.main__articleBody").each((inx, article)=> {
            $(article).find("iframe").each((inx, e_ifm)=> {
                const id = $(e_ifm).attr("id");
                if (id != null && id.indexOf("-ads-") >= 0) {
                    $(e_ifm).detach();
                }
            });
        });
    }

    static filtering_saitama_np_pr() {
        // 記事自体が消えてしまうのでAdBlockplus無効化
        // →個別に消す
        $("div#pagehead").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div#ad_top");
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
            HTMLUtil.detach_child_element(elem, "div#ad_middle");
            HTMLUtil.detach_child_element(elem, "div#ad_bottom");
        });
        // 左右大外に追加されたg-ads
        $("div.ats-skyscraper-wrapper").each((inx, wrapper)=>{
            $(wrapper).detach();
        });
    }

    static filtering_kanaloco_pr() {
        // 検索結果が消えてしまうのでAdBlockplus無効化
        // →個別に消す
        HTMLUtil.detach_element("div.top-head-bnr");
        HTMLUtil.detach_element("div.blk-bnr01.section02");
        HTMLUtil.detach_element("div.blk-bnr02");
        $("div.subarea_free2_pc").each((inx, elem)=>{
            const ad = $(elem).find("div#ad1");
            if (ad.length > 0) {
                $(elem).detach();
            }
        });
        // recommendに混ぜ込んでくる奴(独自)
        $("div.views-element-container").each((inx, e_cont)=> {
            $(e_cont).find("ul#recommendations").each((inx, e_rec)=> {
                $(e_rec).find("li").each((inx, elem)=> {
                    const ads_node
                        = HTMLUtil.search_element_by_attr(elem, "div", "id", "_ads_");
                    if (ads_node != null) {
                        $(elem).detach();
                    }
                });
            });
        });
    }
    
    static filtering_kyoto_np_pr() {
        // 独自バナーが消えない
        $("div#Ad").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div.BnrLnkSbs");
        });
    }

    static filtering_nikkan_gendai_pr() {
        $("div.right-menu").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div.ad-box");
            HTMLUtil.detach_child_element(elem, "div.osusume-ranking.lanking-box");
            $(elem).find("div.infeed").each((inx, e_inf)=> {
                if ($(e_inf).find("div#_popIn_infeed").length > 0) {
                    $(e_inf).detach();
                }
            });
        });
    }

    static filtering_bunshun_pr() {
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

    static filtering_nlab_pr() {
        $("div#masterSub").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div#colBoxPrArticle");
            HTMLUtil.detach_child_element(elem, "div#colBoxKodanshaManga");
        });
    }

    static filtering_4gamer_pr() {
        HTMLUtil.detach_element("dl#NOTIFY_EVENT");
        $("div.right_contents").each((inx, elem)=> {
            HTMLUtil.detach_child_element(elem, "div.sidetop");
            HTMLUtil.detach_child_element(elem, "div.topics");
            HTMLUtil.detach_child_element(elem, "div.skyscraper");
            HTMLUtil.detach_child_element(elem, "div.paidpub_special");
        });
    }

    /*!
     *  @param  is_tweet    ツイートか？
     *  @note   promotionはABPで対応された(ABPindo+EasyList)
     *  @note   他人のfavやfollow情報はmuteで対応できる
     */
    static filtering_twitter_pr(is_tweet) {
        $("main").each((inx, m_elem)=>{
            // trends
            $(m_elem).find("section").each((inx, sec_elem)=>{
                const sec_role = $(sec_elem).attr("aria-labelledby");
                if (sec_role == null) {
                    return;
                }
                const tl = HTMLUtil.search_element_by_attr_param(sec_elem,
                                                                 "div",
                                                                 "aria-label",
                                                                 "タイムライン: トレンド");
                if (tl != null) {
                    $(sec_elem).detach();
                }
            });
            if (is_tweet) {
                // other tweets
                $(m_elem).find("section").each((inx, sec_elem)=>{
                    const sec_role = $(sec_elem).attr("aria-labelledby");
                    if (sec_role == null) {
                        return;
                    }
                    const tl = HTMLUtil.search_element_by_attr_param(sec_elem,
                                                                     "div",
                                                                     "aria-label",
                                                                     "タイムライン: ツイート");
                    if (tl == null) {
                        return;
                    }
                    var dispoff = false;
                    $(tl.childNodes[0]).children().each((inx, dv_elem)=>{
                        if (dispoff) {
                            HTMLUtil.display_off(dv_elem);
                            return;
                        }
                        const e = HTMLUtil.search_element_by_attr(dv_elem,
                                                                  "h2",
                                                                  "aria-level");
                        if (e == null) {
                            return;
                        }
                        if ($($(e).find("span")[0]).text() == "その他のツイート") {
                            HTMLUtil.display_off(dv_elem);
                            dispoff = true;
                        }
                    });
                });
            } else {
                // topics
                $(m_elem).find("section").each((inx, sec_elem)=>{
                    const sec_role = $(sec_elem).attr("aria-labelledby");
                    if (sec_role == null) {
                        return;
                    }
                    const tl = HTMLUtil.search_element_by_attr_param(sec_elem,
                                                                     "div",
                                                                     "aria-label",
                                                                     "タイムライン: ");
                    if (tl == null) {
                        return;
                    }
                    $(tl.childNodes[0]).children().each((inx, dv_elem)=>{
                        const e = HTMLUtil.search_element_by_attr_param(
                                            dv_elem,
                                            "div",
                                            "aria-label",
                                            "タイムライン: Carousel");
                        if (e != null) {
                            HTMLUtil.display_off(dv_elem);
                        }
                    });
                });
            }
        });
    }
}
