<p align="center"><img width="120" src="https://github.com/PEDx/BannerMan/blob/develop/static/img/logo.png" alt="Vue logo"></p>
<h2 align="center">Banner Man</h2>
<p align="center">a web editer base vuejs ecosystem</p>

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
    location /manager {
        try_files $uri $uri/ /manager.html;
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
