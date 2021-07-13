/*!
 *  @brief  HTML操作関数群
 */
class HTMLUtil {

    /*!
     *  @brief  任意の要素をdetachする
     *  @param  identifier  要素識別子
     */
    static detach_element(identifier) {
        $(identifier).each((inx, elem)=> {
            $(elem).detach();
        });
    }
    /*!
     *  @brief  任意の子要素をdetachする
     *  @param  parent      親要素
     *  @param  identifier  要素識別子
     */
    static detach_child_element(parent, identifier) {
        $(parent).find(identifier).each((inx, elem)=> {
            $(elem).detach();
        });
    }
    /*!
     *  @brief  任意の弟要素をdetachする
     *  @param  parent      親要素
     */
    static detach_under_sibling_element(parent) {
        var end_sibling = parent;
        for (var unit = parent;
             unit != null && $(unit).length > 0;
             unit = $(unit).next()) {
             end_sibling = $(unit).next();
        }
        var work = null;
        var pv = end_sibling;
        while (pv != parent) {
            work = pv;
            pv = $(work).prev();
            $(work).detach();
        }
    }

    /*!
     *  @brief  特定attrを持つ要素を探す
     *  @param  elem        基準要素
     *  @param  node_id     調べる要素(識別子指定)
     *  @param  attr_id     attr識別子
     *  @note   first-hit
     */
    static search_element_by_attr(elem, node_id, attr_id) {
        var ret = null;
        $(elem).find(node_id).each((inx, n_elem)=> {
            if ($(n_elem).attr(attr_id) != null) {
                ret = n_elem;
                return false;
            }
            return true;
        });
        return ret;
    }
    /*!
     *  @brief  特定文字列をattrに含む要素を探す
     *  @param  elem        基準要素
     *  @param  node_id     調べる要素(識別子指定)
     *  @param  attr_id     attr識別子
     *  @param  key_str     探す文字列
     *  @note   first-hit
     */
    static search_element_by_attr_param(elem, node_id, attr_id, key_str) {
        var ret = null;
        $(elem).find(node_id).each((inx, n_elem)=> {
            const attr = $(n_elem).attr(attr_id);
            if (attr != null) {
                if (attr.indexOf(key_str) >= 0) {
                    ret = n_elem;
                    return false;
                }
            }
            return true;
        });
        return ret;
    }

    /*!
     *  @brief  特定文字列をattrに含む要素を探す(基点から上へ)
     *  @param  elem        基準要素
     *  @param  tag         調べる要素(htmlタグ指定)
     *  @param  identifier  attr識別子
     *  @param  key_str     探す文字列
     *  @note   first-hit
     */
    static search_upper_element_by_attr_param(elem, tag, identifier, key_str) {
        while(elem.length > 0) {
            if (elem.nodeName == tag) {
                const attr = $(elem).attr(identifier);
                if (attr != null && attr.indexOf(key_str) == 0) {
                    return elem;
                }
            }
            elem = elem.parent();
        }
        return {length:0};
    }

    /*!
     *  @brief  表示offにする
     *  @param  elem    消す要素
     *  @note   detachはせずにcssで消すだけ
     */
    static display_off(elem) {
        const org_attr = $(elem).attr("style");
        if (org_attr == null || org_attr.indexOf("display: none") >= 0) {
            return;
        }
        $(elem).attr("style", org_attr + "display: none");
    }
}
