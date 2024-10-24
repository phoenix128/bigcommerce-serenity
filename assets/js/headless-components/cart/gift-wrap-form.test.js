import Alpine from 'alpinejs';
import './gift-wrap-form';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityGiftWrapForm', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
        <form x-data="serenityGiftWrapForm({
            imagePreviewSize: '256x256',
            wrappings: [
                { id: 1, selected: true, allow_message: true, preview_image: { data: '/images/wrapping_1_{:size}.jpg', alt: 'Wrapping 1' } },
                { id: 2, selected: false, allow_message: false, preview_image: { data: '/images/wrapping_2_{:size}.jpg', alt: 'Wrapping 2' } }
            ]
        })">
            <input x-model="giftWrapMode" type="radio" name="giftwraptype" checked="checked" value="same" id="single-group-button">
            <input x-model="giftWrapMode" type="radio" name="giftwraptype" value="different" id="multi-group-button">

            <div x-show="isSingleGiftWrap" x-data="serenityGiftWrapItemDetail" id="single-group">
                <div x-show="!!previewImageUrl" x-cloak>
                    <a :href="previewImageZoomUrl" target="_blank"><img :src="previewImageUrl" :alt="previewImageAlt" /></a>
                    <span x-text="previewImageAlt" />
                </div>

                <select x-model="selectedWrapping" name="giftwrapping[all]">
                    <option value="">Select a wrapping</option>
                    <option value="1">Wrapping 1</option>
                    <option value="2">Wrapping 2</option>
                </select>

                <textarea x-cloak x-show="hasMessage" class="input" name="giftmessage[all]" id="giftMessage"></textarea>
            </div>

            <div x-show="!isSingleGiftWrap" id="multi-group">
                
            </div>
        </form>
        `;
        Alpine.initTree(document.body); // Initialize the Alpine tree
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should switch between single and multiple wrapping', async () => {
        const singleGroup = document.getElementById('single-group');
        const multipleGroup = document.getElementById('multi-group');
        const singleGroupButton = document.getElementById('single-group-button');
        const multipleGroupButton = document.getElementById('multi-group-button');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        singleGroupButton.click();
        await delayPromise();

        expect(singleGroup.style.display).toBe('');
        expect(multipleGroup.style.display).toBe('none');
        expect(componentInstance.giftWrapMode).toBe('same');

        multipleGroupButton.click();
        await delayPromise();

        expect(singleGroup.style.display).toBe('none');
        expect(multipleGroup.style.display).toBe('');
        expect(componentInstance.giftWrapMode).toBe('different');       
    });

    test('should select a wrapping and show details', async () => {
        const componentInstance = Alpine.$data(document.getElementById('single-group'));
        const singleGroupButton = document.getElementById('single-group-button');
        const wrappingSelect = document.querySelector('select[name="giftwrapping[all]"]');

        singleGroupButton.click();
        await delayPromise();

        componentInstance.onWrappingChange('1');
        await delayPromise();

        expect(wrappingSelect.value).toBe('1');
        expect(document.getElementById('giftMessage').style.display).toBe('');
        expect(document.querySelector('img').getAttribute('src')).toBe('/images/wrapping_1_256x256.jpg');
        expect(document.querySelector('img').getAttribute('alt')).toBe('Wrapping 1');
    });

    test('should not show message input if wrapping does not allow message', async () => {
        const componentInstance = Alpine.$data(document.getElementById('single-group'));
        const singleGroupButton = document.getElementById('single-group-button');

        singleGroupButton.click();
        await delayPromise();

        componentInstance.onWrappingChange('2');
        await delayPromise();
        expect(document.getElementById('giftMessage').style.display).toBe('none');
    });
});
