FROM denoland/deno:alpine-2.3.1

# Ports
EXPOSE 8000

# Working directory within the container
WORKDIR /app

# Copy files over
COPY ./server .

# Compile the main app so that it doesn't need to be compiled each startup/entry
RUN deno cache main.ts

CMD ["run", "--allow-env", "--allow-run", "start.ts"]
