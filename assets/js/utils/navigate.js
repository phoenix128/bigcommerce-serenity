const navigate = (url, animate = true) => {
    if (window?.swup) {
        window.swup.navigate(url, { animate });
        return;
    }

    window.location.href = url;
}

export default navigate;