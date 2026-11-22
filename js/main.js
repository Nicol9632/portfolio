// カード一覧：絞り込み（chips）とページ切り替え（data-per-page）
document.querySelectorAll('.cards').forEach((list) => {
    const section = list.closest('section');
    const chips = section ? section.querySelectorAll('.chips .chip') : [];
    const perPage = Number(list.dataset.perPage) || Infinity;
    const items = Array.from(list.children);

    let filter = 'all';
    let page = 0;

    // ページ切り替えボタン（1ページあたりの枚数を決めた一覧だけ）
    let nav = null;
    let prev = null;
    let next = null;
    let count = null;

    if (perPage !== Infinity) {
        nav = document.createElement('nav');
        nav.className = 'card-pager';
        nav.setAttribute('aria-label', 'ページ切り替え');
        nav.innerHTML = `
            <button type="button" class="pill pill--white" data-dir="-1">← 前へ</button>
            <p class="card-pager-count" aria-live="polite"></p>
            <button type="button" class="pill pill--white" data-dir="1">次へ →</button>
        `;
        list.after(nav);
        prev = nav.querySelector('[data-dir="-1"]');
        next = nav.querySelector('[data-dir="1"]');
        count = nav.querySelector('.card-pager-count');

        nav.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            page += Number(button.dataset.dir);
            render();
        });
    }

    // 今の絞り込みに合うカードだけを返す
    function matchedItems() {
        if (filter === 'all') return items;
        return items.filter((li) => (li.dataset.tags || '').split(',').includes(filter));
    }

    function render() {
        const matched = matchedItems();
        const pages = Math.max(1, Math.ceil(matched.length / perPage));
        page = Math.min(page, pages - 1);

        items.forEach((li) => { li.hidden = true; });
        matched
            .slice(page * perPage, (page + 1) * perPage)
            .forEach((li) => { li.hidden = false; });

        if (nav) {
            nav.hidden = pages <= 1;
            count.textContent = `${page + 1} / ${pages}`;
            prev.disabled = page === 0;
            next.disabled = page === pages - 1;
        }
    }

    // ボタンを押したときの処理
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            filter = chip.dataset.filter || 'all';
            page = 0;
            chips.forEach((c) => {
                const on = c === chip;
                c.classList.toggle('chip--on', on);
                c.setAttribute('aria-pressed', String(on));
            });
            render();
        });
    });

    render();
});