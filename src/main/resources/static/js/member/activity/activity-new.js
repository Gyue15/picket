layui.use('carousel', function(){
    let carousel = layui.carousel;
    //建造实例
    carousel.render({
        elem: '#activity-gallery'
        ,width: '80%' //设置容器宽度
        ,arrow: 'always' //始终显示箭头
        //,anim: 'updown' //切换动画方式
    });
});