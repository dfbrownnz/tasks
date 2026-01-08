# STAGE 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build for production
COPY . .
RUN npm run build --configuration=production
RUN ls -R dist/

# STAGE 2: Serve with Nginx
FROM nginx:alpine

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf 

RUN ls -R /usr/src/app/dist

# Replace 'YOUR_PROJECT_NAME' with the 'name' from your package.json
#COPY --from=build /usr/src/app/dist/tasks/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/tasks/browser /usr/share/nginx/html



# Optional: Copy a custom nginx.conf if you use Angular Routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Add this line to change the default port from 80 to 8080
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Create the cache directory and set permissions
RUN mkdir -p /tmp/nginx_cache && chmod -R 777 /tmp/nginx_cache

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# Build the image: 
    # docker build -t angular-app .
# Run the container: 
    # docker run -p 8080:80 angular-app
