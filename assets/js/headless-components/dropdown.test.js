import './dropdown';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityDropdown', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <div x-data="serenityDropdown({ initialState: false, transition: false })">
                        <button x-bind="button">Toggle Dropdown</button>
                        <div x-bind="menu">
                            <ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
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

    test('initial state should be closed', () => {
        const dropdownMenu = document.querySelector('[x-bind="menu"]');
        expect(dropdownMenu).not.toBeVisible();
    });

    test('should open dropdown when button is clicked', async () => {
        const dropdownButton = document.querySelector('[x-bind="button"]');
        const dropdownMenu = document.querySelector('[x-bind="menu"]');

        dropdownButton.click();
        await delayPromise();

        expect(dropdownMenu).toBeVisible();
    });

    test('should close dropdown when button is clicked twice', async () => {
        const dropdownButton = document.querySelector('[x-bind="button"]');
        const dropdownMenu = document.querySelector('[x-bind="menu"]');

        dropdownButton.click();
        await delayPromise();
        expect(dropdownMenu).toBeVisible();
        dropdownButton.click();
        await delayPromise();

        expect(dropdownMenu).not.toBeVisible();
    });

    test('should close dropdown when pressing escape key', async () => {
        const dropdownButton = document.querySelector('[x-bind="button"]');
        const dropdownMenu = document.querySelector('[x-bind="menu"]');

        dropdownButton.click();
        await delayPromise();
        expect(dropdownMenu).toBeVisible();

        dropdownMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await delayPromise();

        expect(dropdownMenu).not.toBeVisible();
    });
});
