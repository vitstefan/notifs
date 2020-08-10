/** Enums representing notification's options. */
/** Light and dark theme */
var NTheme;
(function (NTheme) {
    NTheme[NTheme["Light"] = 0] = "Light";
    NTheme[NTheme["Dark"] = 1] = "Dark";
})(NTheme || (NTheme = {}));
/** Notification content type - differs in content color */
var NContentType;
(function (NContentType) {
    NContentType[NContentType["Default"] = 0] = "Default";
    NContentType[NContentType["Success"] = 1] = "Success";
    NContentType[NContentType["Error"] = 2] = "Error";
    NContentType[NContentType["Warning"] = 3] = "Warning";
    NContentType[NContentType["Info"] = 4] = "Info";
})(NContentType || (NContentType = {}));
/** Position of notification (with BottomRightCorner consider setting Regime to JustOne or Clear) */
var NPosition;
(function (NPosition) {
    NPosition[NPosition["WholeScreen"] = 0] = "WholeScreen";
    NPosition[NPosition["RightSide"] = 1] = "RightSide";
    NPosition[NPosition["BottomSide"] = 2] = "BottomSide";
    NPosition[NPosition["BottomRightCorner"] = 3] = "BottomRightCorner";
})(NPosition || (NPosition = {}));
/** Regime - JustOne (shows only last notification), Dominant (shows all notifications, but the last one is more dominant), SideBySide (shows all notifications), Clear (shown only last and clears history) */
var NRegime;
(function (NRegime) {
    NRegime[NRegime["JustOne"] = 0] = "JustOne";
    NRegime[NRegime["Dominant"] = 1] = "Dominant";
    NRegime[NRegime["SideBySide"] = 2] = "SideBySide";
    NRegime[NRegime["Clear"] = 3] = "Clear";
})(NRegime || (NRegime = {}));
/** Lifespan of notification, when TillClosed set, close button will appear */
var NLifespan;
(function (NLifespan) {
    NLifespan[NLifespan["OneSecond"] = 0] = "OneSecond";
    NLifespan[NLifespan["TwoSeconds"] = 1] = "TwoSeconds";
    NLifespan[NLifespan["ThreeSeconds"] = 2] = "ThreeSeconds";
    NLifespan[NLifespan["FourSeconds"] = 3] = "FourSeconds";
    NLifespan[NLifespan["FiveSeconds"] = 4] = "FiveSeconds";
    NLifespan[NLifespan["TillClosed"] = 5] = "TillClosed";
})(NLifespan || (NLifespan = {}));
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Necessary to call to make notifs work (is called below)
 */
function initNotifs() {
    var olNotifications = document.createElement('ol');
    olNotifications.classList.add('notifs-content', 'notifs-content-hidden');
    var divNotifications = document.createElement('div');
    divNotifications.classList.add('notifs-canvas', 'notifs-canvas-hidden');
    divNotifications.appendChild(olNotifications);
    //append necessary notifs element to body
    document.getElementsByTagName('body')[0].appendChild(divNotifications);
}
initNotifs(); //calling to init notifs
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Call this function with desired parameters to build notification.
 *
 * @param {string} text Content text of notification.
 * @param {NTheme} theme Theme of notification.
 * @param {NContentType} contentType Differentiates content text.
 * @param {NPosition} position Whole screen / Right side / Bottom side / Bottom right corner.
 * @param {NRegime} regime Option to show just the last one or the other notifications too.
 * @param {NLifespan} lifespan Lifespan of notification, could disappear after few seconds or stay there till user dismisses it.
 */
function buildNotification(text, theme, contentType, position, regime, lifespan) {
    if (theme === void 0) { theme = NTheme.Dark; }
    if (contentType === void 0) { contentType = NContentType.Default; }
    if (position === void 0) { position = NPosition.BottomRightCorner; }
    if (regime === void 0) { regime = NRegime.JustOne; }
    if (lifespan === void 0) { lifespan = NLifespan.OneSecond; }
    //remove close button
    removeCloseButton();
    //theme
    document.documentElement.style.setProperty('--notifs-background-color', theme === NTheme.Dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)');
    document.documentElement.style.setProperty('--notifs-content-color', theme === NTheme.Dark ? '#ffffff' : '#000000');
    //position
    getCanvas().classList.remove('notifs-canvas-hidden');
    getContent().classList.remove('notifs-content-hidden');
    switch (position) {
        case NPosition.WholeScreen:
            getCanvas().classList.add('notifs-canvas-whole-screen');
            break;
        case NPosition.RightSide:
            getCanvas().classList.add('notifs-canvas-right-side');
            break;
        case NPosition.BottomSide:
            getCanvas().classList.add('notifs-canvas-bottom-side');
            break;
        default:
            getCanvas().classList.add('notifs-canvas-bottom-right-corner');
            break;
    }
    //regime
    //recommended regime for bottom right corner notification is JustOne or Clear
    switch (regime) {
        case NRegime.Clear:
            clearActives();
            break;
        case NRegime.JustOne:
            hideAll();
            break;
        case NRegime.Dominant:
            makeAllDefault();
            makeAllOpaque();
            break;
        default:
            makeAllDefault();
            break;
    }
    //content and content type
    //it takes roughly about 100 characters to correctly fit bottom right corner notification
    addNotification(text, contentType);
    //lifespan
    if (lifespan !== NLifespan.TillClosed) {
        var timeout = 0;
        switch (lifespan) {
            case NLifespan.TwoSeconds:
                timeout = 2000;
                break;
            case NLifespan.ThreeSeconds:
                timeout = 3000;
                break;
            case NLifespan.FourSeconds:
                timeout = 4000;
                break;
            case NLifespan.FiveSeconds:
                timeout = 5000;
                break;
            default:
                timeout = 1000;
                break;
        }
        setTimeout(function () {
            hide();
        }, timeout);
    }
    else {
        addCloseButton();
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
function getCanvas() {
    return document.getElementsByClassName('notifs-canvas')[0];
}
function getCloseButton() {
    return document.getElementsByClassName('notifs-cross')[0];
}
function getContent() {
    return document.getElementsByClassName('notifs-content')[0];
}
function getActiveCount() {
    return document.getElementById('notifs-content').childElementCount;
}
/**
 * Adds notification to html document. Called from buildNotification.
 */
function addNotification(text, contentType) {
    if (contentType === void 0) { contentType = NContentType.Default; }
    var newNotification = document.createElement('li');
    newNotification.innerHTML = text;
    if (contentType !== NContentType.Default) {
        newNotification.classList.add("notifs-content-type-" + contentType);
    }
    getContent().appendChild(newNotification);
}
function addCloseButton() {
    var closeButton = document.createElement('li');
    closeButton.innerHTML = '&times;';
    closeButton.id = 'notifs-close-button';
    closeButton.classList.add('notifs-close-button');
    closeButton.addEventListener('click', hide);
    getContent().appendChild(closeButton);
}
function removeCloseButton() {
    if (getContent().lastChild !== null && (getContent().lastChild.id === 'notifs-close-button')) {
        getContent().removeChild(getContent().lastChild);
    }
}
function hide() {
    getCanvas().classList.remove('notifs-canvas-whole-screen', 'notifs-canvas-right-side', 'notifs-canvas-bottom-side', 'notifs-canvas-bottom-right-corner');
    getCanvas().classList.add('notifs-canvas-hidden');
    getCanvas().removeEventListener('click', hide);
    getContent().classList.add('notifs-content-hidden');
}
function clearActives() {
    while (getContent().hasChildNodes()) {
        getContent().removeChild(getContent().lastChild);
    }
}
function makeAllDefault() {
    for (var i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.remove('notifs-hidden', 'notifs-opaque');
    }
}
function hideAll() {
    for (var i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.add('notifs-hidden');
    }
}
function makeAllOpaque() {
    for (var i = 0; i < getContent().children.length; i++) {
        getContent().children[i].classList.add('notifs-opaque');
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * This function is called from showcase site. For your project, call buildNotification above to create notifs.
 */
function createNotification() {
    var content = document.getElementById('input-content').value;
    var theme = Number(document.getElementById('select-theme').value);
    var contentType = Number(document.getElementById('select-content-type').value);
    var position = Number(document.getElementById('select-position').value);
    var regime = Number(document.getElementById('select-regime').value);
    var lifespan = Number(document.getElementById('select-lifespan').value);
    buildNotification(content, theme, contentType, position, regime, lifespan);
}
