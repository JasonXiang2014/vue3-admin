# 阶段1：构建前端（自动生成dist，用你的打包命令）
FROM node:16-alpine as build-stage
WORKDIR /app

# 1. 复制code/vue3-admin下的依赖配置（优先缓存依赖，加快构建）
COPY code/vue3-admin/package*.json ./
# 2. 安装依赖（国内镜像，避免下载慢/失败）
RUN npm install --registry=https://registry.npmmirror.com
# 3. 复制code/vue3-admin下的所有前端源码到容器
COPY code/vue3-admin/ ./
# 4. 执行你的打包命令：生成dist目录（核心修改！）
RUN npm run build:release

# 基础镜像：Nginx轻量版（alpine体积小）
FROM nginx:alpine
# 维护者信息（可选）
LABEL maintainer="xiangjian <931477935@qq.com>"
# 把构建阶段生成的dist复制到Nginx静态资源根目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 覆盖Nginx默认配置，解决路由问题
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
EXPOSE 80
# 前台运行Nginx（容器必须前台运行，否则会退出）
CMD ["nginx", "-g", "daemon off;"]