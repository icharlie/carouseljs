// carousel
/* global jQuery, window, console */
(function(window, $) {
    'use strict';
    function IDXCarousel(config) {
        config = $.extend({
            isExist: false,
            useCss: false,
            boxSizeing: 'border-box',
            outer: '.IDX-outerCarouselWrapper',
            inner: '.IDX-innerCarouselWrapper',
            cell: '.IDX-carouselLink',
            cloneCell: '.IDX-carouselCloneCell',
            arrow: '.IDX-carouselArrow',
            prevArrow: '.IDX-carouselPrevArrow',
            nextArrow: '.IDX-carouselNextArrow',
            arrowWidth: 40,
            arrowBackground: 'white',
            columns: 3,
            cellWidth: 130,
            responsive: false, // TODO
            responsiveFn: null,
            hideArrow: false, // TODO
            autoPlay: false, // TODO
            draggable: false, // TODO
            swipe: false, // TODO
            vertical: false, // TODO
            transformsEnabled: false,  // TODO
            lazyLoading: false // TODO
        }, config);
        $.extend(this, config);
    }

    IDXCarousel.prototype.init = function() {
        // cache cells
        this.cells = $(this.cell);
        if (this.cells.length) {
            this.isExist = true;
            this.buildWrapper();
            if (! this.hideArrow ) {
                this.buildArrow();
            }
            // force cells using box-sizing
            this.setUpCells();

            if (this.useCss) {
                this.currentIndex = 0;
                this.lastIndex = Math.floor(this.cells.length / this.columns);
                if ((this.cells.length % this.columns) === 0) {
                    this.lastIndex--;
                }
                
                this.carouselByCss();
            } else {
                this.carouselByJavascript();
            }
        } else {
            console.error("Can't find any element");
        }
    };

    IDXCarousel.prototype.buildWrapper = function() {
        var cells = this.cells;
        // prepare outer, innter and arrow
        if (! $(this.outer).length) {
            cells.parent().append($('<div>').addClass(this.outer.replace('.','')));
        }

        if (! $(this.outer).find(this.inner).length) {
            $(this.outer).append($('<div>').addClass(this.inner.replace('.','')));
        }

        // remove clone cells and update cache cells element
        $(this.inner + ' ' + this.cloneCell).remove();
        this.cells = $(this.cell);
    };

    IDXCarousel.prototype.setUpCells = function() {
            var cells = this.cells;
            // force cell using border-box mode.
            cells.css('box-sizing', this.boxSizeing);
    };

    IDXCarousel.prototype.buildArrow = function() {
        // prepare arrow
        if (! $(this.prevArrow).length || ! $(this.nextArrow).length) {
            $(this.outer).parent().append(
                $('<a>').attr({'href':'#', 'data-direction':'prev'}).addClass(this.prevArrow.replace('.','') +' '+ this.arrow.replace('.','')).append(
                    $('<span>').text('<')
                )
            );
            $(this.outer).parent().append(
                $('<a>').attr({'href':'#', 'data-direction':'next'}).addClass(this.nextArrow.replace('.','') +' '+ this.arrow.replace('.','')).append(
                    $('<span>').text('>')
                )
            );
        } else {
            $(this.prevArrow).unbind('click');
            $(this.nextArrow).unbind('click');
        }
    };

    IDXCarousel.prototype.carouselByJavascript = function() {
        var cells = this.cells,
            outerWrap = $(this.outer),
            innerWrap = $(this.inner),
            cellSize = cells.length,
            circleCells = cells.slice(0, this.columns),
            i;

        // append and prepend clone elements for infinite
        $(this.inner).append(cells);
        for (i = 0; i < circleCells.length; i++) {
              innerWrap.append($(circleCells[i]).clone().addClass(this.cloneCell.replace('.','')));
        }
        circleCells = cells.slice(cells.length - this.columns, cells.length);
        for (i = circleCells.length; i >= 0; i--) {
              innerWrap.prepend($(circleCells[i]).clone().addClass(this.cloneCell.replace('.','')));
        }

        outerWrap.parent().css({
            display: 'inline-block',
            position: 'relative',
            margin: '0 '+ this.arrowWidth+'px'
        });

        // for all cells including prepend and append cells.
        $(this.cell).css({
            display: 'inline-block',
            width: parseInt(this.cellWidth, 10),
            float: 'left'
        });

        var ceellOuterWidth = cells.outerWidth(true);
        var outerHeight = cells.outerHeight(true);

        // arrow position and style
        $(this.arrow).css({
            display: 'inline-block',
            position: 'absolute',
            float: 'left',
            top: 0,
            width: this.arrowWidth,
            height: outerHeight,
            'text-align': 'center',
            'text-decoration': 'none'
        });

        $(this.arrow + ' span').css({
            position: 'absolute',
            top: '50%',
            'margin-top': '-50%'
        });

        $(this.prevArrow).css({
            left: 0
        });

        $(this.nextArrow).css({
            right: 0
        });


        outerWrap.css({
            width: ceellOuterWidth * parseInt(this.columns, 10),
            margin: 0 + ' ' + this.arrowWidth + 'px',
            height: outerHeight,
            overflow: 'hidden',
            position: 'relative'
        });

        var offset = outerWrap.outerWidth();

        innerWrap.css({
            position: 'relative',
            width: ceellOuterWidth * $(this.cell).length,
            height: outerHeight,
            left: '-'+offset+'px'
        });

        var allCellsWidth = (cells.length + this.columns) * cells.outerWidth(true),
            forwardOffset= cells.length * cells.outerWidth(true),
            isAnimating = false;
        $(this.arrow).click(function(e){
            e.preventDefault();
            var direction = $(this).data('direction');
            if (!isAnimating) {
                var position = parseFloat(innerWrap.css('left').replace('px',''));
                if (direction === 'prev') {
                    if((position + offset) > 0){
                        position -= (cellSize * ceellOuterWidth);
                        innerWrap.css('left', position);
                    }

                    innerWrap.animate({
                        left: '+=' + offset
                    }, "swing", function(){isAnimating = false;});
                    isAnimating = true;
                } else {
                     if((-(position - offset)) >  allCellsWidth){
                         position = position + forwardOffset;
                         innerWrap.css('left', position);
                     }

                     innerWrap.animate({
                         left: '-=' + offset
                     },"swing",function(){isAnimating = false;});
                     isAnimating = true;
                }
            }
        });
    };

    IDXCarousel.prototype.carouselByCss = function() {
       var cells = this.cells,
            outerWrap = $(this.outer),
            innerWrap = $(this.inner),
            circleCells = cells.slice(0, this.columns),
            i;

        // append and prepend clone elements for infinite
        $(this.inner).append(cells);
        // append and prepend clone elements for infinite
        $(this.inner).append(cells);
        for (i = 0; i < circleCells.length; i++) {
              innerWrap.append($(circleCells[i]).clone().addClass(this.cloneCell.replace('.','')));
        }
        circleCells = cells.slice(cells.length - this.columns, cells.length);
        for (i = circleCells.length; i >= 0; i--) {
              innerWrap.prepend($(circleCells[i]).clone().addClass(this.cloneCell.replace('.','')));
        }        

        outerWrap.parent().css({
            display: 'inline-block',
            position: 'relative',
            margin: '0 '+ this.arrowWidth+'px'
        });

        // for all cells including prepend and append cells.
        $(this.cell).css({
            display: 'inline-block',
            width: parseInt(this.cellWidth, 10),
            float: 'left'
        });

        var ceellOuterWidth = cells.outerWidth(true);
        var outerHeight = cells.outerHeight(true);

        // arrow position and style
        $(this.arrow).css({
            display: 'inline-block',
            position: 'absolute',
            float: 'left',
            top: 0,
            width: this.arrowWidth,
            height: outerHeight,
            'text-align': 'center',
            'text-decoration': 'none'
        });

        $(this.arrow + ' span').css({
            position: 'absolute',
            top: '50%',
            'margin-top': '-50%'
        });

        $(this.prevArrow).css({
            left: 0
        });

        $(this.nextArrow).css({
            right: 0
        });


        outerWrap.css({
            width: ceellOuterWidth * parseInt(this.columns, 10),
            margin: 0 + ' ' + this.arrowWidth + 'px',
            height: outerHeight,
            overflow: 'hidden',
            position: 'relative'
        });

        var offset = outerWrap.outerWidth();

        innerWrap.css({
            position: 'relative',
            width: ceellOuterWidth * $(this.cell).length,
            height: outerHeight,
            transform: 'translate(0px, 0px)'
        });

        var isAnimating = false;

        $(innerWrap).bind('webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd', function() {
            isAnimating = false;
        });
        var self = this;
        $(this.arrow).click(function(e){
            e.preventDefault();
            var direction = $(this).data('direction');
            var newPosition;
            if (!isAnimating) {
                if (direction === 'prev') {
                    if(self.currentIndex === 0){
                        self.currentIndex = self.lastIndex;
                    } else {
                        self.currentIndex--;
                    }
                    newPosition = offset * self.currentIndex;
                } else {
                     if(self.currentIndex === self.lastIndex){
                         self.currentIndex = 0;
                     } else {
                        self.currentIndex++;
                     }
                     newPosition = offset * self.currentIndex;
                }
                innerWrap.css({
                    transform: 'translate(-' + newPosition +'px, 0px)',
                    transition: 'transform 1s ease-in-out',
                    '-webkit-transition': '-webkit-transform 1s ease-in-out'                 
                });
                                
            }
        });
    };        

    window.IDXCarousel = IDXCarousel;

    $.fn.idxCarousel = function(config) {
        return this.each(function(index, element) {
            element.IDXCarousel = new IDXCarousel(config);
            element.IDXCarousel.init();
        });
    };
})(window, jQuery);

