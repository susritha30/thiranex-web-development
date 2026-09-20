export function getRoute() {
    const hash = window.location.hash || "#home";
    return hash.substring(1);
}

export function navigate(route) {
    window.location.hash = route;
}

export function startRouter(renderPage) {
    window.addEventListener("hashchange", () => {
        renderPage(getRoute());
    });

    renderPage(getRoute());
}
