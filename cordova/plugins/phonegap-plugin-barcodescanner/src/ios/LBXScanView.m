
//
//  LBXScanView.m
//
//
//  Created by lbxia on 15/11/15.
//  Copyright © 2015年 lbxia. All rights reserved.
//

#import "LBXScanView.h"



@interface LBXScanView()

//扫码区域
@property (nonatomic,assign)CGRect scanRetangleRect;

//线条扫码动画封装
@property (nonatomic,strong)LBXScanLineAnimation *scanLineAnimation;

@end

@implementation LBXScanView


-(id)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame])
    {
        self.backgroundColor = [UIColor clearColor];
    }
    
    return self;
}


- (void)drawRect:(CGRect)rect
{
    [self drawScanRect];
    
}

/**
 *  开始扫描动画
 */
- (void)startScanAnimation
{
    if (!_scanLineAnimation)
        self.scanLineAnimation = [[LBXScanLineAnimation alloc]init];
    
    UIImage *imgLine = [UIImage imageNamed:@"CDVBarcodeScanner.bundle/qrcode_scan_light_green"];
    [_scanLineAnimation startAnimatingWithRect:_scanRetangleRect
                                        InView:self
                                         Image:imgLine];

}



/**
 *  结束扫描动画
 */
- (void)stopScanAnimation
{
    if (_scanLineAnimation) {
        [_scanLineAnimation stopAnimating];
    }
}


- (void)drawScanRect
{
    int XRetangleLeft = 60;
    
    CGSize sizeRetangle = CGSizeMake(MIN(self.frame.size.width, 500) - XRetangleLeft*2, MIN(self.frame.size.width, 500) - XRetangleLeft*2);
    
    //if (!_viewStyle.isScanRetangelSquare)
    {
        CGFloat w = sizeRetangle.width;
        CGFloat h = w / 1;
        
        NSInteger hInt = (NSInteger)h;
        h  = hInt;
        
        sizeRetangle = CGSizeMake(w, h);
    }
    
    //扫码区域Y轴最小坐标
    CGFloat YMinRetangle = self.frame.size.height / 2.0 - sizeRetangle.height/2.0;
    CGFloat YMaxRetangle = YMinRetangle + sizeRetangle.height;
    CGFloat XMinRetangle = self.frame.size.width / 2.0 - sizeRetangle.width/2.0;
    CGFloat XMaxRetangle = XMinRetangle + sizeRetangle.width;
    
    
    
    NSLog(@"frame:%@",NSStringFromCGRect(self.frame));
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    
    //非扫码区域半透明
    /*{
        //设置非识别区域颜色
        CGContextSetRGBFillColor(context, 0,0,0, 0.5);
        
        //填充矩形
        
        //扫码区域上面填充
        CGRect rect = CGRectMake(0, 0, self.frame.size.width, YMinRetangle);
        CGContextFillRect(context, rect);
        
        
        //扫码区域左边填充
        rect = CGRectMake(0, YMinRetangle, XMinRetangle,sizeRetangle.height);
        CGContextFillRect(context, rect);
        
        //扫码区域右边填充
        rect = CGRectMake(XMaxRetangle, YMinRetangle, XMinRetangle,sizeRetangle.height);
        CGContextFillRect(context, rect);
        
        //扫码区域下面填充
        rect = CGRectMake(0, YMaxRetangle, self.frame.size.width, self.frame.size.height - YMaxRetangle);
        CGContextFillRect(context, rect);
        //执行绘画
        CGContextStrokePath(context);
    }*/
    
    {
        //中间画矩形(正方形)
        UIColor* colorRetangleLine = [UIColor whiteColor];
        CGContextSetStrokeColorWithColor(context, colorRetangleLine.CGColor);
        CGContextSetLineWidth(context, 1);
        
        CGContextAddRect(context, CGRectMake(XMinRetangle, YMinRetangle, sizeRetangle.width, sizeRetangle.height));
        
        
        CGContextStrokePath(context);
        
    }
    _scanRetangleRect = CGRectMake(XMinRetangle, YMinRetangle, sizeRetangle.width, sizeRetangle.height);
    
    
    //画矩形框4格外围相框角
    
    //相框角的宽度和高度
    int wAngle = 24;
    int hAngle = 24;
    
    //4个角的 线的宽度
    CGFloat linewidthAngle = 6;// 经验参数：6和4
    
    //画扫码矩形以及周边半透明黑色坐标参数
    CGFloat diffAngle = linewidthAngle/3;
    UIColor* colorAngle = [UIColor colorWithRed:0. green:167./255. blue:231./255. alpha:1.0];
    CGContextSetStrokeColorWithColor(context, colorAngle.CGColor);
    CGContextSetRGBFillColor(context, 1.0, 1.0, 1.0, 1.0);
    
    // Draw them with a 2.0 stroke width so they are a bit more visible.
    CGContextSetLineWidth(context, linewidthAngle);
    
    
    //
    CGFloat leftX = XMinRetangle - diffAngle;
    CGFloat topY = YMinRetangle - diffAngle;
    CGFloat rightX = XMaxRetangle + diffAngle;
    CGFloat bottomY = YMaxRetangle + diffAngle;
    
    //左上角水平线
    CGContextMoveToPoint(context, leftX-linewidthAngle/2, topY);
    CGContextAddLineToPoint(context, leftX + wAngle, topY);
    
    //左上角垂直线
    CGContextMoveToPoint(context, leftX, topY-linewidthAngle/2);
    CGContextAddLineToPoint(context, leftX, topY+hAngle);
    
    
    //左下角水平线
    CGContextMoveToPoint(context, leftX-linewidthAngle/2, bottomY);
    CGContextAddLineToPoint(context, leftX + wAngle, bottomY);
    
    //左下角垂直线
    CGContextMoveToPoint(context, leftX, bottomY+linewidthAngle/2);
    CGContextAddLineToPoint(context, leftX, bottomY - hAngle);
    
    
    //右上角水平线
    CGContextMoveToPoint(context, rightX+linewidthAngle/2, topY);
    CGContextAddLineToPoint(context, rightX - wAngle, topY);
    
    //右上角垂直线
    CGContextMoveToPoint(context, rightX, topY-linewidthAngle/2);
    CGContextAddLineToPoint(context, rightX, topY + hAngle);
    
    
    //右下角水平线
    CGContextMoveToPoint(context, rightX+linewidthAngle/2, bottomY);
    CGContextAddLineToPoint(context, rightX - wAngle, bottomY);
    
    //右下角垂直线
    CGContextMoveToPoint(context, rightX, bottomY+linewidthAngle/2);
    CGContextAddLineToPoint(context, rightX, bottomY - hAngle);
    
    CGContextStrokePath(context);
}




@end
