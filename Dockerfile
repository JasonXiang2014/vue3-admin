# 基础镜像：Nginx轻量版（alpine体积小）
FROM nginx:alpine
# 维护者信息（可选）
LABEL maintainer="xiangjian <931477935@qq.com>"
# 复制前端打包产物到Nginx默认静态目录
COPY dist/ /usr/share/nginx/html/
# 覆盖Nginx默认配置，解决路由问题
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
EXPOSE 80
# 前台运行Nginx（容器必须前台运行，否则会退出）
CMD ["nginx", "-g", "daemon off;"]