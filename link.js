const YML = require("yamljs");
const fs = require("fs");

const blacklist = ["SunoAPI"]; // 由于某种原因，不想订阅的列表

let friends = [],
  data_f = YML.parse(
    fs
      .readFileSync("source/_data/link.yml")
      .toString()
      .replace(/(?<=rss:)\s*\n/g, ' ""\n'),
  );

data_f.forEach((entry, index) => {
  let lastIndex = 4; // 这里限制了组数，自己按照要求修改，因为我默认是后面才是不需要订阅的组，前面都是有用的，如果你不一样可以尝试用gpt帮你修改一下
  if (index < lastIndex) {
    const filteredLinkList = entry.link_list.filter(
      (linkItem) => !blacklist.includes(linkItem.name),
    );
    friends = friends.concat(filteredLinkList);
  }
});

// 根据规定的格式构建 JSON 数据
const friendData = {
  friends: friends.map((item) => {
    return [item.name, item.link, item.avatar];
  }),
};

// 将 JSON 对象转换为字符串
const friendJSON = JSON.stringify(friendData, null, 2);

// 写入 friend.json 文件
fs.writeFileSync("./source/friend.json", friendJSON);

console.log("friend.json 文件已生成。");
