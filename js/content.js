/*!
 *  @brief  content.js本体
 */
class Content {

    constructor() {
        this.current_location = new urlWrapper(location.href);
        this.blocker = new PrivateAdblocker(this.current_location);
    }
}
var gContent = new Content();
