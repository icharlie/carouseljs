/* global describe, it, loadFixtures, expect, IDXCarousel, beforeEach */
describe("Carousel uses Js", function() {
    var carousel1, carousel2, carouselWithoutArrows, cell;

    beforeEach(function() {
        cell = '.IDX-showcaseCell';
        carousel1 = new IDXCarousel();
        carousel2 = new IDXCarousel({
            cell: cell,
            columns: 5
        });
        carouselWithoutArrows = new IDXCarousel({
            cell: cell,
            columns: 5,
            hideArrow: true
        });
    });

    it('should load fixtures into dom', function() {
        loadFixtures('carousel_fixture_1.html');
        expect($('#jasmine-fixtures')).toExist();
    });

    it("shouldn't create carousel because there is no element.", function() {
        loadFixtures('carousel_fixture_1.html');
        carousel1.init();
        expect(carousel1.isExist).toBe(false);
    });

    it("should find carousel element and configuration is correct.", function() {
        loadFixtures('carousel_fixture_2.html');
        carousel2.init();
        expect(carousel2.isExist).toBe(true);
        expect(carousel2.useCss).toBe(false);
        expect(carousel2.columns).toBe(5);
    });

    it("should not build arrows", function() {
        loadFixtures('carousel_fixture_2.html');
        carouselWithoutArrows.init();
        var arrows = $(carouselWithoutArrows.arrow);
        expect(arrows.size()).toBe(0);
    });

    it("should be equal between total width of arrows and visible cells' width, and outer container width", function() {
        loadFixtures('carousel_fixture_2.html');
        carousel2.init();
        expect(carousel2.isExist).toBe(true);
        var visibleWidth = $('.IDX-outerCarouselWrapper').outerWidth(true);
        var totalWidth = $('.IDX-carouselArrow').outerWidth(true) * $('.IDX-carouselArrow').size() + $('.IDX-showcaseCell').outerWidth(true) * carousel2.columns;
        expect(totalWidth).toBe(visibleWidth);
    });

});
