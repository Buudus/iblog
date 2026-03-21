/*
 Navicat Premium Data Transfer

 Source Server         : mongodb_local
 Source Server Type    : MongoDB
 Source Server Version : 70024 (7.0.24)
 Source Host           : localhost:27017
 Source Schema         : lyblog

 Target Server Type    : MongoDB
 Target Server Version : 70024 (7.0.24)
 File Encoding         : 65001

 Date: 21/03/2026 15:37:09
*/


// ----------------------------
// Collection structure for access_logs
// ----------------------------
db.getCollection("access_logs").drop();
db.createCollection("access_logs");

// ----------------------------
// Documents of access_logs
// ----------------------------

// ----------------------------
// Collection structure for admin_roles
// ----------------------------
db.getCollection("admin_roles").drop();
db.createCollection("admin_roles");
db.getCollection("admin_roles").createIndex({
    name: NumberInt("1")
}, {
    name: "name_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of admin_roles
// ----------------------------
db.getCollection("admin_roles").insert([ {
    _id: ObjectId("68d9d35edb055481223616f3"),
    name: "admin",
    description: "超级管理员",
    createdAt: "2025年09月29日 08:30:23",
    updatedAt: "2025年09月29日 08:30:23",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for admin_users
// ----------------------------
db.getCollection("admin_users").drop();
db.createCollection("admin_users");
db.getCollection("admin_users").createIndex({
    username: NumberInt("1")
}, {
    name: "username_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of admin_users
// ----------------------------
db.getCollection("admin_users").insert([ {
    _id: ObjectId("68d9d7794d33c6c4d882dd34"),
    avatar: "/resource/1773914700628_pzqnkz.webp",
    nickname: "LanYun",
    username: "admin",
    password: "0b27eae2ff68ce67bd7f4fac508eaf2d99624b2da4607c87af31e8b629714d58",
    role: "admin",
    createdAt: "2025年09月29日 08:47:27",
    updatedAt: "2026年03月21日 15:18:10",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for article_behavior
// ----------------------------
db.getCollection("article_behavior").drop();
db.createCollection("article_behavior");

// ----------------------------
// Documents of article_behavior
// ----------------------------
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69676edac985bca8fab4fe59"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: true,
    browseProgress: NumberInt("40"),
    browsingDuration: NumberInt("20"),
    createdAt: "2026年01月14日 18:24:26",
    updatedAt: "2026年01月14日 18:24:47",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69676ef9c985bca8fab4fe89"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("44"),
    browsingDuration: NumberInt("10"),
    createdAt: "2026年01月14日 18:24:57",
    updatedAt: "2026年01月14日 18:40:25",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69676f09c985bca8fab4feac"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: true,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("20"),
    createdAt: "2026年01月14日 18:25:13",
    updatedAt: "2026年01月14日 18:43:14",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696772ccec88518b7a20d6db"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月14日 18:41:16",
    updatedAt: "2026年01月14日 18:41:16",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696772d5ec88518b7a20d6f5"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月14日 18:41:25",
    updatedAt: "2026年01月14日 18:41:25",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696772daec88518b7a20d70b"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("32"),
    browsingDuration: NumberInt("95"),
    createdAt: "2026年01月14日 18:41:30",
    updatedAt: "2026年01月14日 18:43:16",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696773ac716f624364894d76"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139e"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: true,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月14日 18:45:00",
    updatedAt: "2026年01月14日 18:45:32",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696773b5716f624364894d90"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1398"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: true,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月14日 18:45:09",
    updatedAt: "2026年01月14日 18:45:32",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696775d8e90bf0a735724f09"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("45"),
    browsingDuration: NumberInt("5"),
    createdAt: "2026年01月14日 18:54:16",
    updatedAt: "2026年01月14日 18:54:21",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696862493f3c3e9f5b12073c"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139e"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月15日 11:43:05",
    updatedAt: "2026年01月15日 11:43:05",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696862553f3c3e9f5b120751"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("19"),
    browsingDuration: NumberInt("5"),
    createdAt: "2026年01月15日 11:43:17",
    updatedAt: "2026年01月15日 11:43:22",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696a081c68ac4f7310a209c4"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1398"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月16日 17:42:52",
    updatedAt: "2026年01月16日 17:44:15",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696a08c568ac4f7310a20a4e"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139a"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月16日 17:45:41",
    updatedAt: "2026年01月16日 17:45:41",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696a08ca68ac4f7310a20a67"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月16日 17:45:46",
    updatedAt: "2026年01月16日 17:45:46",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("696c69c3f65ae3ee725e988f"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b13a2"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年01月18日 13:04:04",
    updatedAt: "2026年01月18日 13:04:18",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a04734816b15c8b966d4"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 13:31:51",
    updatedAt: "2026年02月19日 13:31:51",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a04834816b15c8b966dd"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 13:31:52",
    updatedAt: "2026年02月19日 13:32:05",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a45913ed97a89594a12f"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 13:49:13",
    updatedAt: "2026年02月19日 13:49:13",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a45d13ed97a89594a13e"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("30"),
    createdAt: "2026年02月19日 13:49:17",
    updatedAt: "2026年02月19日 13:49:47",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a48113ed97a89594a19d"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 13:49:53",
    updatedAt: "2026年02月19日 13:49:53",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a48613ed97a89594a1b6"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("30"),
    createdAt: "2026年02月19日 13:49:58",
    updatedAt: "2026年02月19日 13:52:29",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a4dc13ed97a89594a267"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "未知",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("60"),
    createdAt: "2026年02月19日 13:51:24",
    updatedAt: "2026年02月19日 13:52:25",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a7096c2ac45036492f3e"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "::1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 14:00:41",
    updatedAt: "2026年02月19日 14:00:41",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a70d6c2ac45036492f57"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "::1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("5"),
    createdAt: "2026年02月19日 14:00:45",
    updatedAt: "2026年02月19日 14:00:50",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a7146c2ac45036492f74"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139e"),
    ip: "::1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月19日 14:00:52",
    updatedAt: "2026年02月19日 14:00:52",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("6996a71a6c2ac45036492f8d"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1398"),
    ip: "::1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("5"),
    createdAt: "2026年02月19日 14:00:58",
    updatedAt: "2026年02月19日 14:01:03",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("699ad1d6215760a27ce807b7"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月22日 17:52:22",
    updatedAt: "2026年02月22日 17:52:22",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("699ad1e2215760a27ce80818"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月22日 17:52:34",
    updatedAt: "2026年02月22日 17:52:34",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("699ad1e7215760a27ce80831"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b1394"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年02月22日 17:52:39",
    updatedAt: "2026年02月22日 17:52:39",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae93d9a8d900aa9b7d12f8"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月09日 17:33:13",
    updatedAt: "2026年03月09日 17:33:13",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae93d9a8d900aa9b7d12fa"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月09日 17:33:13",
    updatedAt: "2026年03月09日 17:33:13",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae93e3a8d900aa9b7d131a"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("170"),
    createdAt: "2026年03月09日 17:33:23",
    updatedAt: "2026年03月09日 17:36:18",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae9492a8d900aa9b7d1632"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月09日 17:36:18",
    updatedAt: "2026年03月09日 17:36:18",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae9498a8d900aa9b7d1666"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月09日 17:36:24",
    updatedAt: "2026年03月09日 17:36:24",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae9499a8d900aa9b7d1676"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("15"),
    createdAt: "2026年03月09日 17:36:25",
    updatedAt: "2026年03月09日 17:36:41",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae94aca8d900aa9b7d16dc"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月09日 17:36:44",
    updatedAt: "2026年03月09日 17:36:44",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae94ada8d900aa9b7d16e6"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("70"),
    createdAt: "2026年03月09日 17:36:45",
    updatedAt: "2026年03月09日 17:44:24",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69ae95516270b68ca1f4e8c3"),
    articleId: ObjectId("6916cb00fd22e7cc8b0b139d"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("23"),
    browsingDuration: NumberInt("120"),
    createdAt: "2026年03月09日 17:39:29",
    updatedAt: "2026年03月09日 17:45:01",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69afaf72bee31fd298d113ce"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月10日 13:43:14",
    updatedAt: "2026年03月10日 13:43:14",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69afaf72bee31fd298d113d8"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月10日 13:43:14",
    updatedAt: "2026年03月10日 13:43:14",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69afaf78bee31fd298d113f8"),
    articleId: ObjectId("69ae9490a8d900aa9b7d1606"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月10日 13:43:20",
    updatedAt: "2026年03月10日 13:43:20",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bcf9361715ec10896d7a40"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("78"),
    browsingDuration: NumberInt("60"),
    createdAt: "2026年03月20日 15:37:26",
    updatedAt: "2026年03月20日 15:38:26",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bcf9361715ec10896d7a4a"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 15:37:26",
    updatedAt: "2026年03月20日 15:37:26",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bcfbe5bf4abda5f08d8063"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("50"),
    createdAt: "2026年03月20日 15:48:53",
    updatedAt: "2026年03月20日 15:49:43",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd1fb6eb091f228fbe2aa9"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:21:42",
    updatedAt: "2026年03月20日 18:21:42",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd1fb6eb091f228fbe2aab"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "Unknown",
    user: "未知游客",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:21:42",
    updatedAt: "2026年03月20日 18:21:42",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd1fbceb091f228fbe2abb"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("94"),
    browsingDuration: NumberInt("260"),
    createdAt: "2026年03月20日 18:21:48",
    updatedAt: "2026年03月20日 18:26:09",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2554d9dec8bceeecfb4a"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:45:40",
    updatedAt: "2026年03月20日 18:45:40",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2555d9dec8bceeecfb54"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("50"),
    createdAt: "2026年03月20日 18:45:41",
    updatedAt: "2026年03月20日 18:46:31",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2622fba5fb16475b1737"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("2"),
    browsingDuration: NumberInt("25"),
    createdAt: "2026年03月20日 18:49:06",
    updatedAt: "2026年03月20日 18:49:35",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2668fba5fb16475b17e3"),
    articleId: ObjectId("69bd2661fba5fb16475b1796"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("5"),
    createdAt: "2026年03月20日 18:50:16",
    updatedAt: "2026年03月20日 18:52:57",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2668fba5fb16475b17ed"),
    articleId: ObjectId("69bd2661fba5fb16475b1796"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:50:16",
    updatedAt: "2026年03月20日 18:50:16",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd26bafba5fb16475b186b"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("2"),
    browsingDuration: NumberInt("15"),
    createdAt: "2026年03月20日 18:51:38",
    updatedAt: "2026年03月20日 18:51:53",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd26bafba5fb16475b1875"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:51:38",
    updatedAt: "2026年03月20日 18:51:38",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd26e1fba5fb16475b18c9"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("100"),
    browsingDuration: NumberInt("40"),
    createdAt: "2026年03月20日 18:52:17",
    updatedAt: "2026年03月20日 18:52:57",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd26e1fba5fb16475b18d3"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:52:17",
    updatedAt: "2026年03月20日 18:52:17",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2720fba5fb16475b1975"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:53:20",
    updatedAt: "2026年03月20日 18:53:20",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69bd2720fba5fb16475b197f"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("0"),
    browsingDuration: NumberInt("0"),
    createdAt: "2026年03月20日 18:53:20",
    updatedAt: "2026年03月20日 18:53:20",
    __v: NumberInt("0")
} ]);
db.getCollection("article_behavior").insert([ {
    _id: ObjectId("69be4a1faecebbc7dea34e06"),
    articleId: ObjectId("69bcab7d366b68abd767c093"),
    ip: "127.0.0.1",
    user: "dad2b062-8c71-4771-ad0e-fba720ae5c29",
    like: false,
    browseProgress: NumberInt("12"),
    browsingDuration: NumberInt("35"),
    createdAt: "2026年03月21日 15:34:55",
    updatedAt: "2026年03月21日 15:35:30",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for articles
// ----------------------------
db.getCollection("articles").drop();
db.createCollection("articles");
db.getCollection("articles").createIndex({
    title: NumberInt("1")
}, {
    name: "title_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of articles
// ----------------------------
db.getCollection("articles").insert([ {
    _id: ObjectId("69bcab7d366b68abd767c093"),
    cover: "/resource/1773972265780_h84ek4.webp",
    title: "蓝云博客 Nuxt3 部署教程（宝塔面板）",
    content: "## 📝 准备工作工具\n\n1. 一台 _Linux_ 云服务器\n2. _Navicat_ 或任意数据库连接工具（支持 _MongoDB_）\n3. _Xshell_ 或其他 _SSH_ 连接工具\n\n## 开始部署 🛩️\n\n[蓝云博客2.0开源项目地址](https://gitee.com/lanyun417/lyblog-2.0)\n\n### 宝塔面板安装\n\n在服务器中安装部署`宝塔面板`，可前往[宝塔官网](https://www.bt.cn)复制最新安装命令或复制以下命令进行安装\n\n```shell\nif [ -f /usr/bin/curl ];then curl -sSO https://download.bt.cn/install/install_panel.sh;else wget -O install_panel.sh https://download.bt.cn/install/install_panel.sh;fi;bash install_panel.sh ed8484bec\n```\n\n在`Xshell`中连接服务器后，将命令粘贴到命令行窗口并回车运行\n![](/resource/1773972755416_kwz016.webp)\n命令行停止输出并出现面板登录信息后即表示安装完成\n![](/resource/1773973467749_w90al1.webp)\n此时复制 _外网ipv4面板地址_ 到外部浏览器中打开，即可进入宝塔面板网页端，并输入账号（username）密码（password）进行登录\n![](/resource/1773973692667_fcmui0.webp)\n安装部署环境所需依赖，若服务器配置≥ `2h2g` 建议选择编译安装，**可以只勾选 Nginx 1.28**\n![](/resource/1773973759356_gla426.webp)\n等待任务列表中的所有任务执行完毕，该过程时间可能较长\n![](/resource/1773973884380_8d8vrn.webp)\n安装完成后点击左侧菜单栏点击`数据库`，开始安装`MongoDB`数据库\n![](/resource/1773986630650_ri4fun.webp)\n![](/resource/1773986648216_cv6unz.webp)\n等待安装完成...\n![](/resource/1773986676876_q2n99s.webp)\n\n### 数据库配置\n\n数据库安装完成后，点击`添加数据库`\n![](/resource/1773987103155_c8o32v.webp)\n![](/resource/1773987124170_tnri87.webp)\n为了保证数据安全，点击`安全认证`，开启安全认证\n![](/resource/1773987249452_p78o32.webp)\n设置数据库密码\n![](/resource/1773987320158_v55nkh.webp)\n设置允许远程连接MongoDB数据库\n![](/resource/1773987432896_v1zcq4.webp)\n按下图指引进行修改，修改完成后点击`保存`\n![](/resource/1773987551392_0m2zhf.webp)\n开启防火墙放行端口 `27017`（部分服务器需要前往厂商控制台服务器安全组中放行端口）\n![](/resource/1773987749952_ddq297.webp)\n![](/resource/1773987897480_wkx68n.webp)\n打开 _Navicat_ 选择连接 `MongoDB` 数据库\n![](/resource/1773988002433_1m35g5.webp)\n![](/resource/1773988162268_d9fim3.webp)\n右键，打开连接\n![](/resource/1773988218794_21gw2a.webp)\n连接成功后打开数据库，点击集合，查看是否有 `chat` 集合，如果有则删除（非必要）\n![](/resource/1773988271591_296rbp.webp)\n右键目标数据库，点击`运行脚本文件`开始导入数据\n![](/resource/1773988365877_78dt1n.webp)\n在项目目录下的db文件夹中选择 **`lyblog.js`** 文件，点击开始导入\n![](/resource/1773988470099_x8yadp.webp)\n![](/resource/1773988474238_5wgdqs.webp)\n导入完成后点击关闭\n![](/resource/1773988513144_vjujxj.webp)\n\n### 网站上传\n\n修改项目下的 `server/plugins/mongoose.ts` 文件中的数据库连接信息\n![](/resource/1773989203809_it3trf.webp)\n修改 `nuxt.config.ts` 文件中的会话密码\n![](/resource/1774076909900_vpfpbt.webp)\n在命令行中运行打包命令 `npm run build`（命令行目录需处在项目目录下）\n![](/resource/1773988680378_yfmdf9.webp)\n![](/resource/1773988943716_ft3btj.webp)\n打包完成后，将项目目录下的 `ip2region`>`data` 目录，复制到 `.output`>`server`>`node_modules`>`ip2region` 下\n![](/resource/1773992073643_bl50b5.webp)\n![](/resource/1773992156348_mg7aqa.webp)\n以上步骤完成后，将打包目录 `.output` 压缩后上传到服务器\n![](/resource/1773990187722_pxq4z1.webp)\n点击开始上传等待上传完成\n![](/resource/1773990237408_t5iphi.webp)\n解压\n![](/resource/1773990290433_ryswt8.webp)\n![](/resource/1773990304092_qsvyqw.webp)\n重命名目录，名称自定义\n![](/resource/1773990332851_hmgh7i.webp)\n\n### 安装 NodeJS\n\n点击 `网站`→`NodeJS项目`，点击安装\n![](/resource/1773990419229_t91fh1.webp)\n![](/resource/1773990443440_oq4ujc.webp)\n选择任意 `18.x+` 以上的稳定版进行安装即可\n![](/resource/1773990575426_5aby30.webp)\n安装完成后设置命令行版本为刚才安装版本\n![](/resource/1773991363870_5tcnwp.webp)\n\n### 配置环境变量\n\n打开终端，输入 `vim /etc/profile` 按下回车执行，编辑环境变量配置文件（如果没有 `vim` 命令，则改成 `vi`）\n![](/resource/1773990746031_jqcjc9.webp)\n步骤：打开文件后，按下键盘 `i` 控制上下左右键，将光标移动到最后一行，输以下内容\n\n```txt\n# = 号后面的内容自定义，越复杂越好\nexport NUXT_TOKEN_SECRET=lyblog\n```\n\n![](/resource/1774077063658_46c11a.webp)\n完成后，按下 `ESC` 键，再按下 `Shift`+`:`，输入 _wq_ 后回车保存即可，保存完成后执行 `source /etc/profile` 使修改生效\n\n### 添加网站\n\n按图中配置进行设置\n![](/resource/1773991242000_hrxyl5.webp)\n打开终端，在命令行中输入 `cd /www/wwwroot/lyblog/server` 执行，切换到项目目录下，输入 `npm i sharp --force` 安装指定依赖\n![](/resource/1773991564132_9u9015.webp)\n安装完成后，返回启动项目\n![](/resource/1773991605350_e0p04z.webp)\n自行添加域名（域名获取方式及使用方法请自行搜索相关教程）\n![](/resource/1773991654275_yhjgyl.webp)\n打开`外网映射`\n![](/resource/1773991771847_gve9f9.webp)\n配置 SSL\n![](/resource/1773991883481_blx81v.webp)\n选择自己的域名，点击`申请证书`\n![](/resource/1773991908676_iaiaw3.webp)\n![](/resource/1773991979153_0l1ixa.webp)\n\n### 测试部署\n\n打开自己的站点域名查看是否可以正常打开\n![](/resource/1773992601824_je2uus.webp)\n切换到 `/admin` 页面查看后台页面是否打开正常\n\n```txt\n账号：admin\n密码：Abc123987\n```\n\n![](/resource/1773992636167_tsm1me.webp)\n",
    author: ObjectId("68d9d7794d33c6c4d882dd34"),
    category: ObjectId("69bcab4a366b68abd767c05d"),
    subCategory: ObjectId("69bcab58366b68abd767c069"),
    tags: [
        "Nuxt3",
        "博客",
        "部署",
        "教程"
    ],
    isPublished: true,
    createdAt: "2026年03月20日 10:05:49",
    updatedAt: "2026年03月21日 15:19:31",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for author_info
// ----------------------------
db.getCollection("author_info").drop();
db.createCollection("author_info");

// ----------------------------
// Documents of author_info
// ----------------------------
db.getCollection("author_info").insert([ {
    _id: ObjectId("69119bce7f7215e957477017"),
    avatar: "/resource/1773914762026_nlofas.webp",
    name: "LanYun",
    ps: "无数普通人中的一个",
    biography: "暂无",
    qq: "168847242",
    wechat: "168847242",
    email: "168847242@qq.com",
    github: "https://gitee.com/lanyun417",
    weibo: "https://gitee.com/lanyun417",
    isUse: "yes",
    createdAt: "2025年11月10日 15:42:04",
    updatedAt: "2026年03月19日 18:06:03",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for categories
// ----------------------------
db.getCollection("categories").drop();
db.createCollection("categories");

// ----------------------------
// Documents of categories
// ----------------------------
db.getCollection("categories").insert([ {
    _id: ObjectId("69bcab4a366b68abd767c05d"),
    name: "教程",
    description: "教程",
    createdAt: "2026年03月20日 10:04:58",
    updatedAt: "2026年03月20日 10:04:58",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for files
// ----------------------------
db.getCollection("files").drop();
db.createCollection("files");

// ----------------------------
// Documents of files
// ----------------------------
db.getCollection("files").insert([ {
    _id: ObjectId("69bbca4c6d2c9c801d88b6ae"),
    name: "1773914700628_pzqnkz.webp",
    originalName: "fc629f77037d576d21a7e8373bb063db.jpg",
    mimetype: "image/webp",
    url: "/resource/1773914700628_pzqnkz.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773914700628_pzqnkz.webp",
    md5: "69f6d829f7b0decd927958a1eb2973a7",
    size: NumberInt("30651"),
    createdAt: "2026年03月19日 18:05:00",
    updatedAt: "2026年03月19日 18:05:00",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bbca7d6d2c9c801d88b6e9"),
    name: "1773914749697_mfx2fl.ico",
    originalName: "favicon.ico",
    mimetype: "image/x-icon",
    url: "/resource/1773914749697_mfx2fl.ico",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773914749697_mfx2fl.ico",
    md5: "c6db57ab9472c59484260bc397b8cdd1",
    size: NumberInt("4286"),
    createdAt: "2026年03月19日 18:05:49",
    updatedAt: "2026年03月19日 18:05:49",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bbca8a6d2c9c801d88b704"),
    name: "1773914762026_nlofas.webp",
    originalName: "pandaer.jpg",
    mimetype: "image/webp",
    url: "/resource/1773914762026_nlofas.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773914762026_nlofas.webp",
    md5: "19196dd8a8e0d7e8c0a8820aa9f62723",
    size: NumberInt("66129"),
    createdAt: "2026年03月19日 18:06:02",
    updatedAt: "2026年03月19日 18:06:02",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcab2a366b68abd767c053"),
    name: "1773972265780_h84ek4.webp",
    originalName: "The 2023 Ford GT Mk IV.jpg",
    mimetype: "image/webp",
    url: "/resource/1773972265780_h84ek4.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773972265780_h84ek4.webp",
    md5: "861bf7d3af72c3ea5dcba590814cc6e1",
    size: NumberInt("594785"),
    createdAt: "2026年03月20日 10:04:26",
    updatedAt: "2026年03月20日 10:04:26",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcad13366b68abd767c0bd"),
    name: "1773972755416_kwz016.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773972755416_kwz016.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773972755416_kwz016.webp",
    md5: "5490e55d3d02d28f2ac85a237b1b7145",
    size: NumberInt("98277"),
    createdAt: "2026年03月20日 10:12:35",
    updatedAt: "2026年03月20日 10:12:35",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcafdb366b68abd767c0f3"),
    name: "1773973467749_w90al1.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773973467749_w90al1.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773973467749_w90al1.webp",
    md5: "e2d6bcc3c33c726f0072b3605279c36a",
    size: NumberInt("125316"),
    createdAt: "2026年03月20日 10:24:27",
    updatedAt: "2026年03月20日 10:24:27",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcb0bc366b68abd767c0f9"),
    name: "1773973692667_fcmui0.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773973692667_fcmui0.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773973692667_fcmui0.webp",
    md5: "ebd99cdbff48bcc4aa51aa6087f5ceaa",
    size: NumberInt("80009"),
    createdAt: "2026年03月20日 10:28:12",
    updatedAt: "2026年03月20日 10:28:12",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcb0ff366b68abd767c0ff"),
    name: "1773973759356_gla426.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773973759356_gla426.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773973759356_gla426.webp",
    md5: "c84bbfb386cdd9a0d896677b5a130477",
    size: NumberInt("225989"),
    createdAt: "2026年03月20日 10:29:19",
    updatedAt: "2026年03月20日 10:29:19",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcb17c366b68abd767c12f"),
    name: "1773973884380_8d8vrn.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773973884380_8d8vrn.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773973884380_8d8vrn.webp",
    md5: "1b271bfb3b020191006c558ecfbfe76a",
    size: NumberInt("45861"),
    createdAt: "2026年03月20日 10:31:24",
    updatedAt: "2026年03月20日 10:31:24",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce34683d0905d8453160e"),
    name: "1773986630650_ri4fun.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773986630650_ri4fun.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773986630650_ri4fun.webp",
    md5: "c15f51510a7200e7d377d5dd0801f14c",
    size: NumberInt("211882"),
    createdAt: "2026年03月20日 14:03:50",
    updatedAt: "2026年03月20日 14:03:50",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce35883d0905d84531614"),
    name: "1773986648216_cv6unz.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773986648216_cv6unz.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773986648216_cv6unz.webp",
    md5: "b12aad199835760de3daf232f5ef3075",
    size: NumberInt("39812"),
    createdAt: "2026年03月20日 14:04:08",
    updatedAt: "2026年03月20日 14:04:08",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce37483d0905d8453161a"),
    name: "1773986676876_q2n99s.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773986676876_q2n99s.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773986676876_q2n99s.webp",
    md5: "154a3698c9453ab05e1fc6b63639eb0b",
    size: NumberInt("40052"),
    createdAt: "2026年03月20日 14:04:36",
    updatedAt: "2026年03月20日 14:04:36",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce51f83d0905d84531620"),
    name: "1773987103155_c8o32v.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987103155_c8o32v.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987103155_c8o32v.webp",
    md5: "88387aef1c06bc4e75e756c095ad61e2",
    size: NumberInt("214644"),
    createdAt: "2026年03月20日 14:11:43",
    updatedAt: "2026年03月20日 14:11:43",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce53483d0905d84531626"),
    name: "1773987124170_tnri87.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987124170_tnri87.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987124170_tnri87.webp",
    md5: "23b807f3f72479bb11d218af8bdd2edd",
    size: NumberInt("17388"),
    createdAt: "2026年03月20日 14:12:04",
    updatedAt: "2026年03月20日 14:12:04",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce56083d0905d8453162c"),
    name: "1773987168303_uwpacb.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987168303_uwpacb.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987168303_uwpacb.webp",
    md5: "9dad997c21f58fecf16c309099cac896",
    size: NumberInt("225202"),
    createdAt: "2026年03月20日 14:12:48",
    updatedAt: "2026年03月20日 14:12:48",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce5b183d0905d84531632"),
    name: "1773987249452_p78o32.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987249452_p78o32.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987249452_p78o32.webp",
    md5: "3b307e0449b28b14262b53339e86dcb2",
    size: NumberInt("193873"),
    createdAt: "2026年03月20日 14:14:09",
    updatedAt: "2026年03月20日 14:14:09",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce5f883d0905d84531638"),
    name: "1773987320158_v55nkh.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987320158_v55nkh.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987320158_v55nkh.webp",
    md5: "e32bbf0cf60bb65e560deb7960a9633f",
    size: NumberInt("195538"),
    createdAt: "2026年03月20日 14:15:20",
    updatedAt: "2026年03月20日 14:15:20",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce66983d0905d8453163e"),
    name: "1773987432896_v1zcq4.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987432896_v1zcq4.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987432896_v1zcq4.webp",
    md5: "6c8560596472eab2de2bf07642b309d3",
    size: NumberInt("235150"),
    createdAt: "2026年03月20日 14:17:13",
    updatedAt: "2026年03月20日 14:17:13",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce6df83d0905d84531644"),
    name: "1773987551392_0m2zhf.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987551392_0m2zhf.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987551392_0m2zhf.webp",
    md5: "abc0c29f21f8781e63d29b41cb8d10cd",
    size: NumberInt("47811"),
    createdAt: "2026年03月20日 14:19:11",
    updatedAt: "2026年03月20日 14:19:11",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce7a683d0905d8453164a"),
    name: "1773987749952_ddq297.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987749952_ddq297.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987749952_ddq297.webp",
    md5: "375fd14d070d0e6cf97522e20c115cd0",
    size: NumberInt("198336"),
    createdAt: "2026年03月20日 14:22:30",
    updatedAt: "2026年03月20日 14:22:30",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce83983d0905d84531650"),
    name: "1773987897480_wkx68n.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773987897480_wkx68n.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773987897480_wkx68n.webp",
    md5: "32c5c4a91efa96264bf783b8508a4c0f",
    size: NumberInt("212668"),
    createdAt: "2026年03月20日 14:24:57",
    updatedAt: "2026年03月20日 14:24:57",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce8a283d0905d84531656"),
    name: "1773988002433_1m35g5.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988002433_1m35g5.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988002433_1m35g5.webp",
    md5: "765128d6c095dc3cd05b4f0960ba7541",
    size: NumberInt("142351"),
    createdAt: "2026年03月20日 14:26:42",
    updatedAt: "2026年03月20日 14:26:42",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce94283d0905d8453165c"),
    name: "1773988162268_d9fim3.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988162268_d9fim3.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988162268_d9fim3.webp",
    md5: "e5b036adae27f0dd53b97ef87a3d30fd",
    size: NumberInt("46946"),
    createdAt: "2026年03月20日 14:29:22",
    updatedAt: "2026年03月20日 14:29:22",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce97a83d0905d84531662"),
    name: "1773988218794_21gw2a.webp",
    originalName: "{52A0725C-61AA-4CE0-833D-5F1CC6B63003}.png",
    mimetype: "image/webp",
    url: "/resource/1773988218794_21gw2a.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988218794_21gw2a.webp",
    md5: "c2235b563c75161da23fd2f7368b42d2",
    size: NumberInt("14321"),
    createdAt: "2026年03月20日 14:30:18",
    updatedAt: "2026年03月20日 14:30:18",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bce9af83d0905d84531668"),
    name: "1773988271591_296rbp.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988271591_296rbp.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988271591_296rbp.webp",
    md5: "d426ee7c53acbc5ff2eedf85b25b63e7",
    size: NumberInt("105954"),
    createdAt: "2026年03月20日 14:31:11",
    updatedAt: "2026年03月20日 14:31:11",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcea0d83d0905d8453166e"),
    name: "1773988365877_78dt1n.webp",
    originalName: "{120E0528-6C70-4F11-AAB9-10455FA6B87E}.png",
    mimetype: "image/webp",
    url: "/resource/1773988365877_78dt1n.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988365877_78dt1n.webp",
    md5: "8c54129d6f0c9f9c6d0e00df13a1deb5",
    size: NumberInt("22749"),
    createdAt: "2026年03月20日 14:32:45",
    updatedAt: "2026年03月20日 14:32:45",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcea7683d0905d84531674"),
    name: "1773988470099_x8yadp.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988470099_x8yadp.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988470099_x8yadp.webp",
    md5: "6e1e6c03d4253f12d37f1d2424d357a3",
    size: NumberInt("41470"),
    createdAt: "2026年03月20日 14:34:30",
    updatedAt: "2026年03月20日 14:34:30",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcea7a83d0905d8453167a"),
    name: "1773988474238_5wgdqs.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988474238_5wgdqs.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988474238_5wgdqs.webp",
    md5: "301386f5e01bf06258840026baf2cc7d",
    size: NumberInt("19805"),
    createdAt: "2026年03月20日 14:34:34",
    updatedAt: "2026年03月20日 14:34:34",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bceaa183d0905d84531680"),
    name: "1773988513144_vjujxj.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988513144_vjujxj.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988513144_vjujxj.webp",
    md5: "fda9d8f0eaa8636d8a20bb365074ddb9",
    size: NumberInt("15425"),
    createdAt: "2026年03月20日 14:35:13",
    updatedAt: "2026年03月20日 14:35:13",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bceb48fa6399d6ba233b94"),
    name: "1773988680378_yfmdf9.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988680378_yfmdf9.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988680378_yfmdf9.webp",
    md5: "a9be12cd2125fa2298e6c52e08ef69c2",
    size: NumberInt("93991"),
    createdAt: "2026年03月20日 14:38:00",
    updatedAt: "2026年03月20日 14:38:00",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcec4ffa6399d6ba233bc0"),
    name: "1773988943716_ft3btj.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773988943716_ft3btj.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773988943716_ft3btj.webp",
    md5: "154a29bea3e229e0d263d96bfe275c93",
    size: NumberInt("112683"),
    createdAt: "2026年03月20日 14:42:23",
    updatedAt: "2026年03月20日 14:42:23",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bced53633c8087989497ff"),
    name: "1773989203809_it3trf.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773989203809_it3trf.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773989203809_it3trf.webp",
    md5: "7eab2f381a45a499650e1b1cf3aa42b0",
    size: NumberInt("81919"),
    createdAt: "2026年03月20日 14:46:43",
    updatedAt: "2026年03月20日 14:46:43",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcedd4633c808798949837"),
    name: "1773989332486_4gh3w7.webp",
    originalName: "{39F6F550-3095-4A3F-B52C-D959D564E543}.png",
    mimetype: "image/webp",
    url: "/resource/1773989332486_4gh3w7.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773989332486_4gh3w7.webp",
    md5: "15c8df13ddc58ec8292e1db0d676fcac",
    size: NumberInt("65399"),
    createdAt: "2026年03月20日 14:48:52",
    updatedAt: "2026年03月20日 14:48:52",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf0464063171a1f4d0332"),
    name: "1773989958129_21fbm6.webp",
    originalName: "{1F041BB2-BD3D-4A72-B20B-6F3CC9B5C6EE}.png",
    mimetype: "image/webp",
    url: "/resource/1773989958129_21fbm6.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773989958129_21fbm6.webp",
    md5: "ca02bd860e48e6167ef63eb4135ca181",
    size: NumberInt("52939"),
    createdAt: "2026年03月20日 14:59:18",
    updatedAt: "2026年03月20日 14:59:18",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf12b1715ec10896d782a"),
    name: "1773990187722_pxq4z1.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990187722_pxq4z1.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990187722_pxq4z1.webp",
    md5: "487b2df63314a91c147a7270bc0dec9f",
    size: NumberInt("204046"),
    createdAt: "2026年03月20日 15:03:07",
    updatedAt: "2026年03月20日 15:03:07",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf15d1715ec10896d7830"),
    name: "1773990237408_t5iphi.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990237408_t5iphi.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990237408_t5iphi.webp",
    md5: "2fbc5481af281b8a95d3cd173e52d087",
    size: NumberInt("28417"),
    createdAt: "2026年03月20日 15:03:57",
    updatedAt: "2026年03月20日 15:03:57",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf1921715ec10896d7836"),
    name: "1773990290433_ryswt8.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990290433_ryswt8.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990290433_ryswt8.webp",
    md5: "83bf4e1dc01deea2b92bf5a2f8e6346d",
    size: NumberInt("148023"),
    createdAt: "2026年03月20日 15:04:50",
    updatedAt: "2026年03月20日 15:04:50",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf1a01715ec10896d783c"),
    name: "1773990304092_qsvyqw.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990304092_qsvyqw.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990304092_qsvyqw.webp",
    md5: "977101e1c9dde55bed2d7d6711a239d3",
    size: NumberInt("22879"),
    createdAt: "2026年03月20日 15:05:04",
    updatedAt: "2026年03月20日 15:05:04",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf1bc1715ec10896d7842"),
    name: "1773990332851_hmgh7i.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990332851_hmgh7i.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990332851_hmgh7i.webp",
    md5: "c8a90714245de8f78717bdc266c9c5a2",
    size: NumberInt("147794"),
    createdAt: "2026年03月20日 15:05:32",
    updatedAt: "2026年03月20日 15:05:32",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf2131715ec10896d7848"),
    name: "1773990419229_t91fh1.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990419229_t91fh1.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990419229_t91fh1.webp",
    md5: "778786949035556e0c2647602c238231",
    size: NumberInt("215326"),
    createdAt: "2026年03月20日 15:06:59",
    updatedAt: "2026年03月20日 15:06:59",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf22b1715ec10896d7878"),
    name: "1773990443440_oq4ujc.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990443440_oq4ujc.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990443440_oq4ujc.webp",
    md5: "3a461ad8b9fd5cd744d5a0cf3bcdbc6f",
    size: NumberInt("89472"),
    createdAt: "2026年03月20日 15:07:23",
    updatedAt: "2026年03月20日 15:07:23",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf2af1715ec10896d787e"),
    name: "1773990575426_5aby30.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990575426_5aby30.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990575426_5aby30.webp",
    md5: "c8e79078df51d531688613999891b76f",
    size: NumberInt("283413"),
    createdAt: "2026年03月20日 15:09:35",
    updatedAt: "2026年03月20日 15:09:35",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf35a1715ec10896d78ae"),
    name: "1773990746031_jqcjc9.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773990746031_jqcjc9.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773990746031_jqcjc9.webp",
    md5: "4280ed7a647dd13c95eb7642059872f6",
    size: NumberInt("124834"),
    createdAt: "2026年03月20日 15:12:26",
    updatedAt: "2026年03月20日 15:12:26",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf54a1715ec10896d790e"),
    name: "1773991242000_hrxyl5.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991242000_hrxyl5.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991242000_hrxyl5.webp",
    md5: "0d916d98336c770681932ab2296a2740",
    size: NumberInt("199935"),
    createdAt: "2026年03月20日 15:20:42",
    updatedAt: "2026年03月20日 15:20:42",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf5c31715ec10896d793e"),
    name: "1773991363870_5tcnwp.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991363870_5tcnwp.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991363870_5tcnwp.webp",
    md5: "b5e6dcfdb666666e363b63066374bdbc",
    size: NumberInt("29899"),
    createdAt: "2026年03月20日 15:22:43",
    updatedAt: "2026年03月20日 15:22:43",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf68c1715ec10896d7944"),
    name: "1773991564132_9u9015.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991564132_9u9015.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991564132_9u9015.webp",
    md5: "ab333aeda16dfef98041086fe247de18",
    size: NumberInt("25150"),
    createdAt: "2026年03月20日 15:26:04",
    updatedAt: "2026年03月20日 15:26:04",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf6b51715ec10896d794a"),
    name: "1773991605350_e0p04z.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991605350_e0p04z.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991605350_e0p04z.webp",
    md5: "b530a019fd7417cb7e873876925365af",
    size: NumberInt("39840"),
    createdAt: "2026年03月20日 15:26:45",
    updatedAt: "2026年03月20日 15:26:45",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf6e61715ec10896d7950"),
    name: "1773991654275_yhjgyl.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991654275_yhjgyl.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991654275_yhjgyl.webp",
    md5: "21772c5072514ed8b5d7f51ba81241a6",
    size: NumberInt("68626"),
    createdAt: "2026年03月20日 15:27:34",
    updatedAt: "2026年03月20日 15:27:34",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf75b1715ec10896d7956"),
    name: "1773991771847_gve9f9.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991771847_gve9f9.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991771847_gve9f9.webp",
    md5: "351426d43648a5387f4875f417be2fdc",
    size: NumberInt("41464"),
    createdAt: "2026年03月20日 15:29:31",
    updatedAt: "2026年03月20日 15:29:31",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf7cb1715ec10896d7986"),
    name: "1773991883481_blx81v.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991883481_blx81v.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991883481_blx81v.webp",
    md5: "e08370fe59a2513cf5054e577d02a92b",
    size: NumberInt("95748"),
    createdAt: "2026年03月20日 15:31:23",
    updatedAt: "2026年03月20日 15:31:23",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf7e41715ec10896d798c"),
    name: "1773991908676_iaiaw3.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991908676_iaiaw3.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991908676_iaiaw3.webp",
    md5: "2da1a0eb62275bf1b2fc1f1c2a982236",
    size: NumberInt("58612"),
    createdAt: "2026年03月20日 15:31:48",
    updatedAt: "2026年03月20日 15:31:48",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf82b1715ec10896d79bc"),
    name: "1773991979153_0l1ixa.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773991979153_0l1ixa.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773991979153_0l1ixa.webp",
    md5: "3ec33d377474dd53680367147ac87c85",
    size: NumberInt("132386"),
    createdAt: "2026年03月20日 15:32:59",
    updatedAt: "2026年03月20日 15:32:59",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf8891715ec10896d79ec"),
    name: "1773992073643_bl50b5.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773992073643_bl50b5.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773992073643_bl50b5.webp",
    md5: "e6017b073c05f63eb193d129b21f1e38",
    size: NumberInt("56992"),
    createdAt: "2026年03月20日 15:34:33",
    updatedAt: "2026年03月20日 15:34:33",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcf8dc1715ec10896d79f2"),
    name: "1773992156348_mg7aqa.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773992156348_mg7aqa.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773992156348_mg7aqa.webp",
    md5: "df2c1fc7424b035af6bedea084b1d1d8",
    size: NumberInt("70873"),
    createdAt: "2026年03月20日 15:35:56",
    updatedAt: "2026年03月20日 15:35:56",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcfa9a1715ec10896d7aa4"),
    name: "1773992601824_je2uus.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773992601824_je2uus.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773992601824_je2uus.webp",
    md5: "f3493d86afc570114ef255f4cb19dabc",
    size: NumberInt("1890969"),
    createdAt: "2026年03月20日 15:43:22",
    updatedAt: "2026年03月20日 15:43:22",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69bcfabc1715ec10896d7aaa"),
    name: "1773992636167_tsm1me.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1773992636167_tsm1me.webp",
    path: "C:\\Users\\LanYun\\Desktop\\lyblog\\public\\resource\\1773992636167_tsm1me.webp",
    md5: "ddb4a67a56edc3653616fb2669f02309",
    size: NumberInt("347207"),
    createdAt: "2026年03月20日 15:43:56",
    updatedAt: "2026年03月20日 15:43:56",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69be43eeaba16d96023feaed"),
    name: "1774076909900_vpfpbt.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1774076909900_vpfpbt.webp",
    md5: "d10f6f40c9177f017632c2c835a8274b",
    size: NumberInt("236378"),
    createdAt: "2026年03月21日 15:08:30",
    updatedAt: "2026年03月21日 15:08:30",
    __v: NumberInt("0")
} ]);
db.getCollection("files").insert([ {
    _id: ObjectId("69be4487aba16d96023feaf3"),
    name: "1774077063658_46c11a.webp",
    originalName: "image.png",
    mimetype: "image/webp",
    url: "/resource/1774077063658_46c11a.webp",
    md5: "b6069147566150e88bdf1fa9bb3d7acc",
    size: NumberInt("66284"),
    createdAt: "2026年03月21日 15:11:03",
    updatedAt: "2026年03月21日 15:11:03",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for friendly_links
// ----------------------------
db.getCollection("friendly_links").drop();
db.createCollection("friendly_links");

// ----------------------------
// Documents of friendly_links
// ----------------------------

// ----------------------------
// Collection structure for leave_messages
// ----------------------------
db.getCollection("leave_messages").drop();
db.createCollection("leave_messages");

// ----------------------------
// Documents of leave_messages
// ----------------------------

// ----------------------------
// Collection structure for photo_album
// ----------------------------
db.getCollection("photo_album").drop();
db.createCollection("photo_album");

// ----------------------------
// Documents of photo_album
// ----------------------------

// ----------------------------
// Collection structure for site_info
// ----------------------------
db.getCollection("site_info").drop();
db.createCollection("site_info");

// ----------------------------
// Documents of site_info
// ----------------------------
db.getCollection("site_info").insert([ {
    _id: ObjectId("68f738eaa6e0e0f9dbb37a78"),
    title: "蓝云博客",
    keywords: "蓝云,博客,LanYun,Blog,前端,NodeJS,后端,Nuxt3,MongoDB,Vue3",
    description: "蓝云博客",
    globalStyle: "",
    globalScript: "",
    domain: "https://lanyunblog.com",
    logo: "/resource/1773914749697_mfx2fl.ico",
    isUse: "yes",
    createdAt: "2025年10月21日 14:39:51",
    updatedAt: "2026年03月19日 18:05:51",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for sub_categories
// ----------------------------
db.getCollection("sub_categories").drop();
db.createCollection("sub_categories");

// ----------------------------
// Documents of sub_categories
// ----------------------------
db.getCollection("sub_categories").insert([ {
    _id: ObjectId("69bcab58366b68abd767c069"),
    name: "安装部署",
    description: "安装部署",
    parentId: ObjectId("69bcab4a366b68abd767c05d"),
    createdAt: "2026年03月20日 10:05:12",
    updatedAt: "2026年03月20日 10:05:12",
    __v: NumberInt("0")
} ]);
