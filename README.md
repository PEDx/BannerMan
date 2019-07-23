# Banner Man

> web editor

### Preview
![img](https://img3.doubanio.com/view/photo/l/public/p2562804471.webp)

### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

### Nginx Config

```bash
server {
    listen       8008 default_server;
    server_name  BannerMan;
    charset      utf-8;
    root         /path/to/BannerMan/dist;

    location /editor {
        try_files $uri $uri/ /index.html;
    }
    location /viewport {
        try_files $uri $uri/ /viewport.html;
    }
    location /render {
        try_files $uri $uri/ /render.html;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Commit Message

> 包括三个字段：type（必需）、scope（可选）和 subject（必需）。

> 例如：\[fix\] 界面两侧板块无法拖拉的 bug

1. type

> type 用于说明 commit 的类别，只允许使用下面 7 个标识。

- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
  > 如果 type 为 feat 和 fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

2. scope

- scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

3. subject

- subject 是 commit 目的的简短描述，不超过 50 个字符。

> 以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
> 第一个字母小写
> 结尾不加句号（.）

### Product Requirements

1. 组件

   - [ ] 容器组件, 可拖入其他组件
   - [ ] 定义可拖拽元素, 拖拽过程中高亮
   - [ ] 文本组件, 按钮组件, 布局容器组件等基础组件

2. 控制器

   - [ ] 颜色选择控制器
   - [ ] 尺寸控制器
   - [ ] 绝对定位坐标控制器
   - [ ] 布局 (内外边距) 控制器
   - [ ] 下拉选择控制器

3. 编辑器
   - [ ] 编辑时弹框通道, 由组件通知编辑者, 优化用户体验
   - [ ] 组件树可生成对应树
   - [ ] 组件搜索, 组件分类
   - [ ] 可注入全局变量, 定义主题颜色
   - [ ] 添加资源支持链接和文件上传
