window.composeControlTheme = {
    initialize: function () {
        const stored = localStorage.getItem("ComposeControl-docs-theme");
        if (stored === "light" || stored === "dark") {
            document.documentElement.setAttribute("data-theme", stored);
        }
    },
    toggle: function () {
        const root = document.documentElement;
        const current = root.getAttribute("data-theme");
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        const effective = current || (prefersDark ? "dark" : "light");
        const next = effective === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", next);
        localStorage.setItem("ComposeControl-docs-theme", next);
    }
};
