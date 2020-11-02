/* jshint esversion: 8 */
(async function () {
    "use strict";
    const baseUri = "https://local.alejo.io:4430/";
    async function getPronouns() {
        var res = await axios.get(baseUri + "pronouns");
        var p = {};
        res.data.forEach((pronoun) => {
            p[pronoun.name] = pronoun.display;
        });
        return p;
    }

    const pronouns = await getPronouns();

    function setItem(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    function getItem(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    async function getUserPronouns() {
        if (getItem('pronouns')) {
            return getItem('pronouns');
        }
        else {
            var res = await axios.get(baseUri + "users");
            var pronouns = {};
            res.data.forEach((user) => {
                pronouns[user.login] = user.pronoun_id;
            });
            setItem('pronouns', pronouns);
            return res.data;
        }
    }
    async function getUserPronoun(username) {
        if (username == null || username.length < 1) {
            return;
        }

        let localPronouns = getItem('pronouns');
        if (localPronouns && localPronouns[username]) {
            return localPronouns[username];
        }
        else {
            var res = await axios.get(baseUri + "users/" + username);
            var pronouns = {};

            if (localPronouns) {
                pronouns = localPronouns;
            }
            res.data.forEach((user) => {
                pronouns[user.login] = user.pronoun_id;
            });
            setItem('pronouns', pronouns);
            return pronouns[username];
        }
    }
    function generatePronounBadge(text) {
        return $('<div>').attr({
            'class': 'tw-inline tw-relative tw-tooltip-wrapper',
            'data-a-target': 'chat-badge',
        }).append($('<span>').attr({
            'class': "chat-badge user-pronoun",
            'data-a-target': "chat-badge",
        }).text(text)).append($('<div>').attr({
            'class': 'tw-tooltip tw-tooltip--align-left tw-tooltip--up',
            'data-a-target': 'tw-tooltip-label',
            'role': 'tooltip',
        }).text('Pronoun'));
    }
    setTimeout(() => {
        getUserPronouns();
        $('[data-test-selector="chat-scrollable-area__message-container"]').on('DOMNodeInserted', async function (e) {
            if (e.target.nodeName == "SPAN") {
                return;
            }
            let target = $(e.target);
            let username = target.find('span.chat-author__display-name').attr('data-a-user');
            let pronoun = await getUserPronoun(username);
            if (username && pronoun) {
                let badges = target.find('.chat-line__username-container.tw-inline-block > span:not([class])');
                badges.append(generatePronounBadge(pronouns[pronoun]));
            }
        });
    }, 3000);
})();