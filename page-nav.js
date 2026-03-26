(() => {
	const pages = [
		{ id: "index.html", href: "index.html" },
		{ id: "experience.html", href: "experience.html" },
		{ id: "projects.html", href: "projects.html" },
		{ id: "inventory.html", href: "inventory.html" },
		{ id: "books.html", href: "books.html" },
		{ id: "links.html", href: "links.html" },
		{ id: "projects_galleryes.html", href: "projects_galleryes.html" }
	];

	const script = document.currentScript;
	const explicitPage = script && script.dataset ? script.dataset.page : null;
	const currentPage = resolveCurrentPage(explicitPage);
	const currentIndex = pages.findIndex((page) => page.id === currentPage);

	if (currentIndex === -1) {
		return;
	}

	const cooldownMs = 800;
	let lastNavAt = 0;

	const isEditableTarget = (target) => {
		if (!target || !(target instanceof Element)) {
			return false;
		}
		return Boolean(
			target.closest(
				"input, textarea, select, [contenteditable=\"true\"], [contenteditable=\"plaintext-only\"]"
			)
		);
	};

	const navigateBy = (delta) => {
		const now = Date.now();
		if (now - lastNavAt < cooldownMs) {
			return;
		}
		lastNavAt = now;
		const total = pages.length;
		const nextIndex = (currentIndex + delta + total) % total;
		window.location.href = pages[nextIndex].href;
	};

	document.addEventListener("keydown", (event) => {
		if (event.defaultPrevented || isEditableTarget(event.target)) {
			return;
		}
		if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			navigateBy(event.shiftKey ? -1 : 1);
			return;
		}
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}
		if (event.key === "ArrowRight" || event.key === "PageDown") {
			navigateBy(1);
			return;
		}
		if (event.key === "ArrowLeft" || event.key === "PageUp") {
			navigateBy(-1);
		}
	});

	let touchStartX = 0;
	let touchStartY = 0;

	window.addEventListener(
		"touchstart",
		(event) => {
			if (isEditableTarget(event.target)) {
				return;
			}
			const touch = event.touches && event.touches[0];
			if (!touch) {
				return;
			}
			touchStartX = touch.clientX;
			touchStartY = touch.clientY;
		},
		{ passive: true }
	);

	window.addEventListener(
		"touchend",
		(event) => {
			if (isEditableTarget(event.target)) {
				return;
			}
			const touch = event.changedTouches && event.changedTouches[0];
			if (!touch) {
				return;
			}
			const deltaX = touch.clientX - touchStartX;
			const deltaY = touch.clientY - touchStartY;
			const horizontalDistance = Math.abs(deltaX);
			const verticalDistance = Math.abs(deltaY);
			if (horizontalDistance < 60 || horizontalDistance < verticalDistance * 1.2) {
				return;
			}
			if (deltaX < 0) {
				navigateBy(1);
				return;
			}
			if (deltaX > 0) {
				navigateBy(-1);
			}
		},
		{ passive: true }
	);

	function resolveCurrentPage(explicit) {
		if (explicit && pages.some((page) => page.id === explicit)) {
			return explicit;
		}
		const path = window.location.pathname || "";
		const lastSegment = path.split("/").filter(Boolean).pop();
		if (!lastSegment) {
			return "index.html";
		}
		const normalized = lastSegment.split("?")[0].split("#")[0];
		if (pages.some((page) => page.id === normalized)) {
			return normalized;
		}
		return null;
	}
})();
