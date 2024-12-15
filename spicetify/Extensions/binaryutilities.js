// @ts-check
/// <reference types="react" />
/// <reference path="./globals.d.ts" />
(async function cacheCleaner() {
    if (Spicetify.Platform?.Offline) {
        Spicetify.Platform.OfflineAPI = Spicetify.Platform.Offline;
        Spicetify.Platform.OfflineAPI._storage = Spicetify.Platform.Offline._storageService;
    }
    if (!Spicetify.Platform?.OfflineAPI?._storage?.getStats || !Spicetify.Platform?.OfflineAPI?._storage?.deleteUnlockedItems) {
        setTimeout(cacheCleaner, 500);
        return;
    }

    // Get config from localStorage
    let config;
    try {
        config = JSON.parse(localStorage.getItem("spicetify-cache-cleaner:config") || "{}");
    } catch {
        config = {};
    }

    /** @type {React} */
    const react = Spicetify.React;
    const { useState, useEffect, useCallback } = react;
    // Date enum in milliseconds
    const time = { launch: 0, daily: 24 * 60 * 60 * 1000, weekly: 24 * 60 * 60 * 1000 * 7, monthly: 30 * 24 * 60 * 60 * 1000 };

    config.enabled = config.enabled ?? true;
    config.notify = config.notify ?? true;
    config.frequency = config.frequency ?? "weekly";
    config.time = config.time ?? Date.now() + time[config.frequency];
    config.threshold = config.threshold ?? 0;
    localStorage.setItem("spicetify-cache-cleaner:config", JSON.stringify(config));

    async function clearCache(purge = false) {
        const stats = await Spicetify.Platform.OfflineAPI._storage.getStats();
        let cacheCleaned = Number(stats.currentSize);

        async function showNotification() {
            await Spicetify.Platform.OfflineAPI._storage.getStats().then((stats) => {
                if (cacheCleaned - Number(stats.currentSize) <= 0 && purge) {
                    // Double check if size has been reduced
                    setTimeout(() => clearCache(purge), 500);
                    return;
                }
                cacheCleaned = cacheCleaned - Number(stats.currentSize);
                if (config.notify || !purge)
                    Spicetify.showNotification(`Cleared ${cacheCleaned} MB of cache`);
            });
        }

        await Spicetify.Platform.OfflineAPI._storage.deleteUnlockedItems()
            .then(showNotification)
            .catch((e) => console.error(e));
    }

    const styling = `.setting-row::after {
        content: "";
        display: table;
        clear: both;
    }
    .setting-row + span {
        font-size: 0.825rem;
    }
    .setting-row .col {
        padding: 16px 0 4px;
        align-items: center;
    }
    .setting-row .col.description {
        float: left;
        padding-right: 15px;
        cursor: default;
    }
    .setting-row .col.action {
        float: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .setting-row .col.action .clear-cache {
        -webkit-tap-highlight-color: transparent;
        font-weight: 700;
        font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
        background-color: transparent;
        border-radius: 500px;
        transition-duration: 33ms;
        transition-property: background-color, border-color, color, box-shadow, filter, transform;
        padding-inline: 15px;
        border: 1px solid #727272;
        color: var(--spice-text);
        min-block-size: 32px;
    }
    .setting-row .col.action .clear-cache:hover {
        transform: scale(1.04);
        border-color: var(--spice-text);
    }
    .setting-row .col.action input {
        width: 100%;
        margin-top: 10px;
        padding: 0 5px;
        height: 32px;
        border: 0;
        color: var(--spice-text);
        background-color: initial;
        border-bottom: 1px solid var(--spice-text);
    }
    button.switch {
        align-items: center;
        border: 0px;
        border-radius: 50%;
        background-color: rgba(var(--spice-rgb-shadow), 0.7);
        color: var(--spice-text);
        cursor: pointer;
        margin-inline-start: 12px;
        padding: 8px;
        width: 32px;
        height: 32px;
    }
    button.switch.disabled,
    button.switch[disabled] {
        color: rgba(var(--spice-rgb-text), 0.3);
    }
    button.switch.small {
        width: 22px;
        height: 22px;
        padding: 3px;
    }`;
    const ButtonSVG = ({ icon, active = true, onClick }) => {
        return react.createElement(
            "button",
            {
                className: "switch" + (active ? "" : " disabled"),
                onClick,
            },
            react.createElement("svg", {
                width: 16,
                height: 16,
                viewBox: "0 0 16 16",
                fill: "currentColor",
                dangerouslySetInnerHTML: {
                    __html: icon,
                },
            })
        );
    };
    const ConfigInput = ({ name, defaultValue, onChange = (value) => {} }) => {
        const [value, setValue] = useState(defaultValue);

        const setValueCallback = useCallback(
            (event) => {
                const value = event.target.value;
                setValue(value);
                onChange(value);
            },
            [value]
        );

        return react.createElement(
            "div",
            {
                className: "setting-row",
            },
            react.createElement(
                "label",
                {
                    className: "col description",
                },
                name
            ),
            react.createElement(
                "div",
                {
                    className: "col action",
                },
                react.createElement("input", {
                    type: "number",
                    value,
                    onChange: setValueCallback,
                })
            )
        );
    };
    const ConfigSlider = ({ name, defaultValue, onChange = (value) => {} }) => {
        const [active, setActive] = useState(defaultValue);

        const toggleState = useCallback(() => {
            const state = !active;
            setActive(state);
            onChange(state);
        }, [active]);

        return react.createElement(
            "div",
            {
                className: "setting-row",
            },
            react.createElement(
                "label",
                {
                    className: "col description",
                },
                name
            ),
            react.createElement(
                "div",
                {
                    className: "col action",
                },
                react.createElement(ButtonSVG, {
                    icon: Spicetify.SVGIcons.check,
                    active,
                    onClick: toggleState,
                })
            )
        );
    };
    const ConfigSelection = ({ name, defaultValue, options, onChange = (value) => {} }) => {
        const [value, setValue] = useState(defaultValue);

        const setValueCallback = useCallback(
            (event) => {
                let value = event.target.value;
                if (!isNaN(Number(value))) {
                    value = parseInt(value);
                }
                setValue(value);
                onChange(value);
            },
            [value]
        );

        return react.createElement(
            "div",
            {
                className: "setting-row",
            },
            react.createElement(
                "label",
                {
                    className: "col description",
                },
                name
            ),
            react.createElement(
                "div",
                {
                    className: "col action",
                },
                react.createElement(
                    "select",
                    {
                        className: "main-dropDown-dropDown",
                        value,
                        onChange: setValueCallback,
                    },
                    Object.keys(options).map((item) =>
                        react.createElement(
                            "option",
                            {
                                value: item,
                            },
                            options[item]
                        )
                    )
                )
            )
        );
    };
    const OptionList = ({ items, onChange }) => {
        const [_, setItems] = useState(items);
        return items.map((item) => {
            if (!item || (item.when && !item.when())) {
                return;
            }

            const onChangeItem = item.onChange || onChange;

            return react.createElement(
                "div",
                null,
                react.createElement(item.type, {
                    ...item,
                    name: item.desc,
                    defaultValue: config[item.key],
                    onChange: (value) => {
                        onChangeItem(item.key, value);
                        setItems([...items]);
                    },
                }),
                item.info &&
                    react.createElement("span", {
                        dangerouslySetInnerHTML: {
                            __html: item.info,
                        },
                    })
            );
        });
    };
    const clearCacheButton = () => {
        const [cacheSize, setCacheSize] = useState("Fetching...");

        useEffect(() => {
            Spicetify.Platform.OfflineAPI._storage.getStats()
                .then((stats) => {
                    setCacheSize(`${stats.currentSize} MB`);
                })
                .catch((e) => console.error(e));
        }, []);

        return react.createElement(
            "div",
            {
                className: "setting-row",
            },
            react.createElement(
                "label",
                {
                    className: "col description",
                },
                `Cache size: ${cacheSize}`
            ),
            react.createElement(
                "div",
                {
                    className: "col action",
                },
                react.createElement(
                    "button",
                    {
                        className: "clear-cache",
                        onClick: async () => {
                            await clearCache();
                            await Spicetify.Platform.OfflineAPI._storage.getStats().then((stats) => {
                                setCacheSize(`${stats.currentSize} MB`);
                            });
                        },
                    },
                    "Clear cache"
                )
            )
        );
    };

    async function openModal() {
        const configContainer = react.createElement(
            "div",
            {
                id: `cache-cleaner-config-container`,
            },
            react.createElement("style", {
                dangerouslySetInnerHTML: {
                    __html: styling,
                },
            }),
            react.createElement(OptionList, {
                items: [
                    {
                        desc: "Enable",
                        info: "Enable automatic cache cleaning",
                        key: "enabled",
                        type: ConfigSlider,
                    },
                    {
                        desc: "Show notification",
                        info: "Notify when cache is cleared automatically",
                        key: "notify",
                        type: ConfigSlider,
                        when: () => config.enabled,
                    },
                    {
                        desc: "Frequency",
                        info: "Automatically clear cache after a certain amount of time",
                        key: "frequency",
                        type: ConfigSelection,
                        options: {
                            never: "Never",
                            launch: "On launch",
                            daily: "After a day",
                            weekly: "After a week",
                            monthly: "After a month",
                        },
                        when: () => config.enabled,
                    },
                    {
                        desc: "Size threshold (MB)",
                        info: "Clear cache when it reaches this size (0 to disable)",
                        key: "threshold",
                        type: ConfigInput,
                        when: () => config.enabled,
                    },
                ],
                onChange: (name, value) => {
                    if (name === "frequency") {
                        if (value === "never") config["time"] = 0;
                        else config["time"] = Date.now() + time[value];
                    }
                    config[name] = value;

                    console.log(config, name, value);
                    localStorage.setItem("spicetify-cache-cleaner:config", JSON.stringify(config));
                },
            }),
            react.createElement(clearCacheButton, null)
        );

        Spicetify.PopupModal.display({
            title: "Cache config",
            // @ts-ignore
            content: configContainer,
            isLarge: true,
        });
    }

    new Spicetify.Menu.Item("Cache config", false, openModal).register();

    if (config.enabled) {
        const stats = await Spicetify.Platform.OfflineAPI._storage.getStats();
        const threshold = Number(config.threshold);

        if (isNaN(threshold)) {
            Spicetify.showNotification("Invalid threshold value, please enter a number");
            config.threshold = 0;
            localStorage.setItem("spicetify-cache-cleaner:config", JSON.stringify(config));
        }

        // Prioritize clearing cache if it's above threshold
        if (!isNaN(threshold) && threshold > 0 && Number(stats.currentSize) > threshold) {
            await clearCache(true);
        } else if (config.time > 0 && Date.now() - config.time > 0) {
            await clearCache(true);
            config.time = Date.now() + time[config.frequency];
            localStorage.setItem("spicetify-cache-cleaner:config", JSON.stringify(config));
        }
    }
})();
