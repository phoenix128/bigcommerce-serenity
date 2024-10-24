import './product-video';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityProductVideo and serenityProductVideoThumb', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div id="video-wrapper" x-data="serenityProductVideo({ featuredId: 'defaultVideoId' })">
                <iframe x-bind="iframe"></iframe>
                <div id="thumb1" x-data="serenityProductVideoThumb({ id: 'video1' })"></div>
                <div id="thumb2" x-data="serenityProductVideoThumb({ id: 'video2' })"></div>
            </div>
        `;

        Alpine.initTree(document.body);
        await delayPromise();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await delayPromise();
    });

    test('should initialize with the correct featured video', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const iframe = document.querySelector('iframe');

        expect(componentInstance.currentVideoId).toBe('defaultVideoId');
        expect(iframe.getAttribute('src')).toBe('https://www.youtube.com/embed/defaultVideoId?rel=0');
    });

    test('should change video when thumbnail is clicked', async () => {
        const thumb1 = document.querySelector('#thumb1');
        const iframe = document.querySelector('iframe');

        thumb1.click();
        await delayPromise();

        expect(iframe.getAttribute('src')).toBe('https://www.youtube.com/embed/video1?rel=0');
    });

    test('should update iframe src when different video is clicked', async () => {
        const thumb2 = document.querySelector('#thumb2');
        const iframe = document.querySelector('iframe');

        thumb2.click();
        await delayPromise();

        expect(iframe.getAttribute('src')).toBe('https://www.youtube.com/embed/video2?rel=0');
    });

    test('should set active class when a thumbnail is clicked', async () => {
        const thumb1 = document.querySelector('#thumb1');
        const thumb2 = document.querySelector('#thumb2');
        const componentInstance = Alpine.$data(thumb1);

        thumb1.click();
        await delayPromise();

        expect(componentInstance.isActive()).toBe(true);
        expect(Alpine.$data(thumb2).isActive()).toBe(false);
    });
});
