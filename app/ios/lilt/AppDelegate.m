/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
    (NSDictionary *)launchOptions
{
  NSURL* jsCodeLocation;

  // uncomment the following block to print available fonts
  /*
  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@" %@", name);
    }
  }
  */

#if DEBUG
  
  // In debug/dev mode we retrieve the javascript bundle from packager
  
  // fill "addr" with packager address (default is localhost:8081, otherwise
  // it is filled from LILT_APP_PACKAGER_APP environment variable)
  NSMutableString* addr = [NSMutableString stringWithString:@"localhost:8081"];
  NSDictionary* envDict = [[NSProcessInfo processInfo] environment];
  NSString* envAddr = [envDict objectForKey:@"LILT_APP_PACKAGER_ADDRESS"];
  if (envAddr != nil)
    [addr setString:envAddr];
  
  NSString* jsBundleURL = [NSString stringWithFormat:
                           @"http://%@/index.ios.bundle?platform=ios&dev=true",
                           addr
                           ];
  
  jsCodeLocation = [NSURL URLWithString:jsBundleURL];

#else
  
  // In release/production mode we use pre-bundled file from disk
  jsCodeLocation = [[NSBundle mainBundle]
                    URLForResource:@"main"
                    withExtension:@"jsbundle"
                    ];

#endif
  
  RCTRootView *rootView = [[RCTRootView alloc]
                           initWithBundleURL:jsCodeLocation
                           moduleName:@"lilt"
                           initialProperties:nil
                           launchOptions:launchOptions
                           ];
  
  rootView.backgroundColor = [[UIColor alloc]
                              initWithRed:1.0f
                              green:1.0f
                              blue:1.0f
                              alpha:1
                              ];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController* rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

@end
