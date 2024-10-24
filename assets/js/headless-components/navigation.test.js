import './navigation';

const delayPromise = () => new Promise((resolve) => setTimeout(resolve, 100));

describe('serenityNavigationItem', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <div x-data="serenityNavigation({ path: '/category' })">
                        <div id="menu-home" x-data="serenityNavigationItem({ url: '/home', transition: false })" :class="{isActive: 'isActive'}"></div>
                        <div id="menu-category" x-data="serenityNavigationItem({ url: '/category', transition: false })" :class="{isActive: 'isActive'}">
                            <div x-bind="childrenMenu" x-ref="childrenMenu">
                                <ul>
                                    <li>Subitem 1</li>
                                    <li>Subitem 2</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;

        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should initialize with menu closed', () => {
        const childrenMenu = document.querySelector('#menu-category > [x-ref="childrenMenu"]');
        expect(childrenMenu).not.toBeVisible();
    });

    test('should open menu when item with children is clicked', async () => {
        const menuCategory = document.querySelector('#menu-category');
        const childrenMenu = document.querySelector('#menu-category > [x-ref="childrenMenu"]');

        menuCategory.click();
        await delayPromise();

        expect(childrenMenu).toBeVisible();
    });

    test('should close menu when item is clicked again', async () => {
        const menuCategory = document.querySelector('#menu-category');
        const childrenMenu = document.querySelector('#menu-category > [x-ref="childrenMenu"]');

        menuCategory.click();
        await delayPromise();

        expect(childrenMenu).toBeVisible();

        menuCategory.click();
        await delayPromise();

        expect(childrenMenu).not.toBeVisible();
    });

    test('should close menu when pressing escape key', async () => {
        const menuCategory = document.querySelector('#menu-category');
        const childrenMenu = document.querySelector('#menu-category > [x-ref="childrenMenu"]');

        menuCategory.click();
        await delayPromise();

        expect(childrenMenu).toBeVisible();

        childrenMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await delayPromise();

        expect(childrenMenu).not.toBeVisible();
    });

    test('should mark isActive if on the same URL', async () => {
        const menuHome = document.querySelector('#menu-category');

        expect(menuHome.classList.contains('isActive')).toBe(true);
    });

    test('should not mark isActive if on a different URL', async () => {
        const menuHome = document.querySelector('#menu-home');

        expect(menuHome.classList.contains('isActive')).toBe(true);
    });
});
