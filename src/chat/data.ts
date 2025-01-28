
export const chats = [
    {
        "role": "user",
        "timestamp": "2025-01-27T01:47:19.326710+00:00",
        "content": {
            "message": "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
            "location": "",
            "latitude": "",
            "longitude": ""
        },
    },
    {
        "role": "model",
        "timestamp": "2025-01-27T01:47:19.326710+00:00",
        "content": {
            "message": "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
            "location": "",
            "latitude": "",
            "longitude": ""
        },
    },
    {
        "role": "user",
        "timestamp": "2025-01-27T01:47:19.326710+00:00",
        "content": {
            "message": "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun.\n\nIf you're interested, let me know, and we can plan the details. It'll be a great way to unwind and enjoy nature.\n\nLooking forward to your response!\n\nBest, Bob",
            "location": "",
            "latitude": "",
            "longitude": ""
        },
    },{
        "role": "model",
        "timestamp": "2025-01-27T01:47:19.326710+00:00",
        "content": {
            "message": "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources.\n\nI've reviewed the budget report and identified a few areas where we might be able to optimize our spending without compromising the project's quality.\n\nI've attached a detailed analysis for your reference. Let's discuss this further in our next meeting.\n\nThanks, Emily",
            "location": "",
            "latitude": "",
            "longitude": ""
        },
    },
]

export type Chat = (typeof chats)[number]