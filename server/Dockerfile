FROM denoland/deno:alpine-2.3.1

# Ports
EXPOSE 8000

# Working directory within the container
WORKDIR /app

# Prefer not to run as root.
USER deno

# Copy files over
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry
RUN deno cache main.ts

CMD ["run", "--allow-net", "--watch", "main.ts"]
