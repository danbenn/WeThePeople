//
//  AppDelegate.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 8/4/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit
import Instabug
import BugsnagReactNative

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

         self.window = UIWindow(frame: UIScreen.main.bounds)

         #if !DEBUG
            Instabug.start(withToken: "e140795f7b604e58644361120c96b45c", invocationEvent: IBGInvocationEvent.shake)
            BugsnagReactNative.start()
         #endif
         let finishedOnboarding = UserDefaults.standard.bool(forKey: "finishedOnboarding")
         if finishedOnboarding  {
            let newsfeedVC = NewsfeedController()
            self.window!.rootViewController = newsfeedVC
            self.window?.makeKeyAndVisible()
         } else {
            let nav = UINavigationController()
            nav.hideNavBarBackground()
            let addressVC = AddressInputController()
            //let onboardingVC = OnboardingController()
            nav.viewControllers = [addressVC]
            nav.hideNavBarBackground()
            self.window!.rootViewController = nav
            self.window?.makeKeyAndVisible()
         }

         return true
    }

   func setupCustomFonts() {
      UILabel.appearance().substituteFontName = "OpenSans"
      UITextView.appearance().substituteFontName = "OpenSans"
      UITextField.appearance().substituteFontName = "OpenSans"
   }


    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}
