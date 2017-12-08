//
//  OnboardingController.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 8/8/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit
import SwiftyJSON
import Firebase

class OnboardingController: UIViewController {

    @IBOutlet weak var viewTitle: UILabel!
    @IBOutlet weak var viewSubtitle: UITextView!
    @IBOutlet weak var magneticView: MagneticView!

    var type: OnboardingViewType = .topicSelect

    var magnetic: Magnetic {
        return magneticView.magnetic
    }

    var topicNodes = [TopicNode]()

    override func viewDidLoad() {
        super.viewDidLoad()
        loadTopicNodes()
        addTopicNodesToScreen()
        switch self.type {
        case .topicSelect:
            viewTitle.text = "Tell us what you're into."
            viewSubtitle.text = "Tap on the topics you like. Swipe to reveal more."
        case .subtopicSelect:
            viewTitle.text = "Choose a few favorites."
            viewSubtitle.text = "Tap on the topics you like. Swipe to reveal more."
        }

        let doneButton = UIBarButtonItem(barButtonSystemItem: .done,
                                         target: self, action: #selector(nextButtonTapped))
        doneButton.isEnabled = false
        self.navigationItem.rightBarButtonItem = doneButton
        magneticView.magnetic.magneticDelegate = self

    }

    func nextButtonTapped() {
        switch type {
        case .topicSelect:
            let nextVC = OnboardingController()
            nextVC.type = .subtopicSelect
            nextVC.topicNodes = topicNodes.filter({ $0.isSelected == true })
            navigationController?.viewControllers = [nextVC]
            break
        case .subtopicSelect:
            let newsfeed = ReactNativeController()
            newsfeed.addReactView()
            if let userID = Auth.auth().currentUser?.uid {
              let subtopics = extractSelectedSubtopics()
              let ref = Database.database().reference()
              ref.child("users/\(userID)/subtopics").setValue(subtopics)
              present(newsfeed, animated: true, completion: nil)
            }
//            else {
//              assert(false)
//            }
            break
        }
    }

    func extractSelectedSubtopics() -> [String] {
        var allSelectedSubtopics = [String]()
        topicNodes.forEach({topicNode in
            let subtopics = topicNode.subtopics.filter({ $0.isSelected })
            let subtopicNames = subtopics.map({ $0.realName })
            allSelectedSubtopics += subtopicNames
        })
        return allSelectedSubtopics
    }

    func loadTopicNodes() {
        do {
            if let file = Bundle.main.url(forResource: "topic_hierarchy_edited",
              withExtension: "json") {
                let data = try Data(contentsOf: file)
                let topicsJson = JSON(data: data)
                for topicJson in topicsJson {
                    topicNodes.append(TopicNode(topicJson.1))
                }
            } else {
                print("no file")
            }
        } catch {
            print(error.localizedDescription)
        }
    }

    func addTopicNodesToScreen() {
        switch type {
        case .topicSelect:
            assert(!topicNodes.isEmpty)
            for topic in topicNodes {
                if topic.image != nil {
                    let node = Node(text: topic.name, image: topic.image!,
                                    color: topic.color, radius: 55)
                    magnetic.addChild(node)
                }
            }
        case .subtopicSelect:
            assert(!topicNodes.isEmpty)
            for topic in topicNodes {
                if topic.image != nil && topic.isSelected {
                    for subtopic in topic.subtopics {
                        let node = Node(text: subtopic.displayName, image: topic.image!,
                                        color: topic.color, radius: 60)
                        magnetic.addChild(node)
                    }
                }
            }
        }
    }
}

extension OnboardingController: MagneticDelegate {
    func magnetic(_ magnetic: Magnetic, didSelect node: Node) {
        let name = node.label.text
        switch type {
        case .topicSelect:
            if let i = topicNodes.index(where: { $0.name == name }) {
                topicNodes[i].isSelected = true
            }
        case .subtopicSelect:
            if let i = topicNodes.index(where: {
                $0.subtopics.index( where: { $0.displayName == name }) != nil
            }) {
                let j = topicNodes[i].subtopics.index( where: { $0.displayName == name })
                topicNodes[i].subtopics[j!].isSelected = true
            }
        }

        self.navigationItem.rightBarButtonItem?.isEnabled = true
        //generator.impactOccurred()
    }

    func magnetic(_ magnetic: Magnetic, didDeselect node: Node) {
        let name = node.label.text
        switch type {
        case .topicSelect:
            if let i = topicNodes.index(where: { $0.name == name }) {
                topicNodes[i].isSelected = false
            }
        case .subtopicSelect:
            if let i = topicNodes.index(where: {
                $0.subtopics.index( where: { $0.displayName == name }) != nil
            }) {
                let j = topicNodes[i].subtopics.index( where: { $0.displayName == name })
                topicNodes[i].subtopics[j!].isSelected = false
            }
        }

        if topicNodes.isEmpty {
            self.navigationItem.rightBarButtonItem?.isEnabled = false
        }
        //generator.impactOccurred()
    }
}

class TopicNode {
    let name: String
    let image: UIImage?
    var subtopics = [Topic]()
    let color: UIColor
    var isSelected = false
    init(_ json: JSON) {
        name = json["topic_display_name"].stringValue
        color = TopicNode.colorMap[json["group_id"].intValue]
        image = UIImage(named: json["image_name"].stringValue)
        let subtopics_display = json["subtopic_display_names"].arrayValue
        let subtopics_full = json["subtopic_full_names"].arrayValue
        assert(subtopics_full.count == subtopics_display.count)
        for (index, _) in subtopics_display.enumerated() {
            let display = subtopics_display[index].stringValue
            let real    = subtopics_full[index].stringValue
            let subtopic = Topic(display, realName: real)
            subtopics.append(subtopic)
        }
    }
    static var colorMap: [UIColor] = [.white, .blue, .pink, .purple, .yellow, .green, .orange]
}

class Topic {
    let displayName: String
    let realName: String
    var isSelected = false
    init(_ displayName: String, realName: String) {
        self.displayName = displayName
        self.realName = realName
    }
}

enum OnboardingViewType {
    case topicSelect
    case subtopicSelect
}
