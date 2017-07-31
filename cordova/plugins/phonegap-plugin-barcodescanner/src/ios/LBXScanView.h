//
//  LBXScanView.h
//
//  github:https://github.com/MxABC/LBXScan
//  Created by lbxia on 15/11/15.
//  Copyright © 2015年 lbxia. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "LBXScanLineAnimation.h"


/**
 扫码区域显示效果
 */
@interface LBXScanView : UIView


/**
 *  开始扫描动画
 */
- (void)startScanAnimation;

/**
 *  结束扫描动画
 */
- (void)stopScanAnimation;


@end
